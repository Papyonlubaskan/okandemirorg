import { NextResponse } from 'next/server'

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  
  if (!accessToken) {
    return NextResponse.json({
      success: false,
      error: 'Instagram access token bulunamadı'
    }, { status: 400 })
  }

  try {
    // Facebook Graph API'den Instagram Business Account media al
    // Önce Instagram Business Account ID'yi al
    const accountResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`)
    
    if (!accountResponse.ok) {
      throw new Error(`Facebook API error: ${accountResponse.status}`)
    }

    const accountData = await accountResponse.json()
    // Facebook accounts retrieved

    // Instagram Business Account bul
    const instagramAccount = accountData.data?.find((account: {instagram_business_account?: {id: string}}) => account.instagram_business_account)
    
    if (!instagramAccount?.instagram_business_account?.id) {
      return NextResponse.json({
        success: false,
        error: 'Instagram Business Account bulunamadı. Lütfen Instagram hesabınızı Facebook Business Account ile bağlayın.'
      }, { status: 400 })
    }

    const instagramAccountId = instagramAccount.instagram_business_account.id
    
    // Instagram media al
    const response = await fetch(`https://graph.facebook.com/v18.0/${instagramAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}`)
    
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      posts: data.data || [],
      count: data.data?.length || 0,
      account_id: instagramAccountId
    })

  } catch (error) {
    // Error handled silently
    return NextResponse.json({
      success: false,
      error: 'Instagram feed yüklenemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
