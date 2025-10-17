// YouTube kanal ID'sini almak için yardımcı script
// Kullanım: node scripts/get-youtube-channel-id.js

const channelUrl = 'https://www.youtube.com/@PapyonluBaskan'

console.log('\n📺 YouTube Kanal ID Alma Yönergeleri:\n')
console.log('1. Tarayıcınızda şu adrese gidin:')
console.log(`   ${channelUrl}\n`)
console.log('2. Sayfada sağ tıklayıp "Kaynağı Görüntüle" veya "View Page Source" seçin\n')
console.log('3. Sayfada Ctrl+F ile "channelId" araması yapın\n')
console.log('4. Şu formatta bir satır bulacaksınız:')
console.log('   "channelId":"UC..."   veya   "externalId":"UC..."\n')
console.log('5. UC ile başlayan ID\'yi kopyalayın (örnek: UCxxxxxxxxxxxxxxxxxxxxxx)\n')
console.log('6. Bulduğunuz ID\'yi buraya yazın!\n')

// Alternatif: RSS feed denemesi
const possibleUrls = [
  `https://www.youtube.com/feeds/videos.xml?user=PapyonluBaskan`,
  `https://www.youtube.com/feeds/videos.xml?channel_id=UCLFPapyonluBaskan`,
]

console.log('📋 Alternatif olarak şu URL\'leri tarayıcınızda deneyin:')
possibleUrls.forEach((url, i) => {
  console.log(`   ${i + 1}. ${url}`)
})
console.log('\nHangi URL çalışıyorsa, XML içinde <yt:channelId> tagını bulacaksınız!\n')

