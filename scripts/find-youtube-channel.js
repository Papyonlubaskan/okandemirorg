// YouTube kanal ID'sini bulmak için yardımcı script

console.log('\n🔍 YouTube Kanal ID Bulma Rehberi\n')

console.log('1️⃣ YÖNTEM - Tarayıcıda:')
console.log('   https://www.youtube.com/@PapyonluBaskan adresine gidin')
console.log('   Sayfada sağ tıklayın → "Kaynağı Görüntüle" (View Page Source)')
console.log('   Ctrl+F ile "channelId" arayın')
console.log('   "channelId":"UC..." şeklinde bir satır bulacaksınız\n')

console.log('2️⃣ YÖNTEM - RSS Feed Test:')
console.log('   Şu URL\'leri tarayıcınızda test edin:\n')

const testUrls = [
  'https://www.youtube.com/feeds/videos.xml?channel_id=UCLFPapyonluBaskan',
  'https://www.youtube.com/feeds/videos.xml?user=PapyonluBaskan',
  'https://www.youtube.com/@PapyonluBaskan/videos.rss'
]

testUrls.forEach((url, i) => {
  console.log(`   ${i + 1}. ${url}`)
})

console.log('\n3️⃣ YÖNTEM - Manuel Kanal ID:')
console.log('   Eğer kanal ID\'nizi biliyorsanız (UC ile başlayan),')
console.log('   bana söyleyin, kodu güncelleyeyim!\n')

console.log('4️⃣ YÖNTEM - Alternatif:')
console.log('   YouTube Studio\'ya gidin → Ayarlar → Kanal')
console.log('   Kanal ID\'nizi orada bulabilirsiniz\n')

console.log('📋 Bulduğunuz kanal ID\'sini (UC ile başlayan) bana verin!')
