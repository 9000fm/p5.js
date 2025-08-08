# Archives sketch.js to archive/YYYYMMDD-N.js, incrementing N per day.
$today = Get-Date -Format "yyyyMMdd"
$folder = "archive"
if (-not (Test-Path $folder)) { New-Item -ItemType Directory -Path $folder | Out-Null }

# Find next index N
$matches = Get-ChildItem $folder -Filter "$today-*.js" -Name |
  ForEach-Object {
    if ($_ -match '^(\d{8})-(\d+)\.js$') { [int]$Matches[2] }
  } | Sort-Object
$next = if ($matches.Count -gt 0) { $matches[-1] + 1 } else { 1 }

$dest = Join-Path $folder "$today-$next.js"
Copy-Item "sketch.js" $dest -Force
Write-Host "Saved as $dest"
