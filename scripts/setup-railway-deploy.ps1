# Railway deploy token kurulumu (bir kez calistir)
# 1) https://railway.com/account/tokens veya proje Settings > Tokens
# 2) "Project Token" olustur (okandemirorg projesi, production)
# 3) Asagidaki komutu calistir

$token = Read-Host "Railway Project Token'ini yapistir" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
$plain | gh secret set RAILWAY_TOKEN -R Papyonlubaskan/okandemirorg
Write-Host "Secret kaydedildi. Deploy baslatiliyor..."
gh workflow run deploy.yml -R Papyonlubaskan/okandemirorg
gh run watch -R Papyonlubaskan/okandemirorg
