#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashSet;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

use tauri::ipc::{InvokeBody, Request};
use tauri::{AppHandle, Manager};
use tauri_plugin_sql::{Migration, MigrationKind};

fn captures_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?.join("captures");
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

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
    let stamp = SystemTime::now().duration_since(UNIX_EPOCH).map_err(|e| e.to_string())?.as_millis();
    let name = format!("{stamp}.{ext}");
    std::fs::write(captures_dir(&app)?.join(&name), bytes).map_err(|e| e.to_string())?;
    Ok(name)
}

#[tauri::command]
fn prune_captures(app: AppHandle, keep: HashSet<String>) -> Result<(), String> {
    for entry in std::fs::read_dir(captures_dir(&app)?).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        if !keep.contains(&*entry.file_name().to_string_lossy()) {
            std::fs::remove_file(entry.path()).map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

fn main() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create trades and days",
            sql: include_str!("../schema.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create accounts",
            sql: include_str!("../schema_accounts.sql"),
            kind: MigrationKind::Up,
        },
    ];
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:trades.db", migrations).build())
        .invoke_handler(tauri::generate_handler![save_capture, prune_captures])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
