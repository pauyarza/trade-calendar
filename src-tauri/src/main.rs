#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::{SystemTime, UNIX_EPOCH};

use tauri::ipc::{InvokeBody, Request};
use tauri::{AppHandle, Manager};
use tauri_plugin_sql::{Migration, MigrationKind};

#[tauri::command]
fn save_capture(app: AppHandle, request: Request) -> Result<String, String> {
    let InvokeBody::Raw(bytes) = request.body() else {
        return Err("expected raw image bytes".into());
    };
    let ext = request
        .headers()
        .get("ext")
        .and_then(|v| v.to_str().ok())
        .filter(|e| ["png", "jpg", "jpeg", "webp", "gif"].contains(e))
        .unwrap_or("png");

    // Write file
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?.join("captures");
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let stamp = SystemTime::now().duration_since(UNIX_EPOCH).map_err(|e| e.to_string())?.as_millis();
    let path = dir.join(format!("{stamp}.{ext}"));
    std::fs::write(&path, bytes).map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().into_owned())
}

fn main() {
    let migrations = vec![Migration {
        version: 1,
        description: "create trades and days",
        sql: include_str!("../schema.sql"),
        kind: MigrationKind::Up,
    }];
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:trades.db", migrations).build())
        .invoke_handler(tauri::generate_handler![save_capture])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
