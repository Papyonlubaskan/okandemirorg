/**
 * AI-Powered Customer Analysis Service
 * Analyzes customer submissions and extracts insights
 */

interface AnalysisResult {
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  priority: 'high' | 'medium' | 'low';
  estimatedBudget: 'low' | 'medium' | 'high' | 'enterprise';
  keywords: string[];
  summary: string;
  confidence: number;
}

/**
 * Analyze customer message and extract insights
 */
export async function analyzeCustomerMessage(
  name: string,
  email: string,
  company: string | undefined,
  message: string
): Promise<AnalysisResult> {
  // Category detection based on keywords
  const category = detectCategory(message);
  
  // Sentiment analysis
  const sentiment = analyzeSentiment(message);
  
  // Priority detection
  const priority = detectPriority(message, sentiment);
  
  // Budget estimation
  const estimatedBudget = estimateBudget(message, company);
  
  // Extract keywords
  const keywords = extractKeywords(message);
  
  // Generate summary
  const summary = generateSummary(name, category, message);
  
  // Calculate confidence score
  const confidence = calculateConfidence(message);
  
  return {
    category,
    sentiment,
    priority,
    estimatedBudget,
    keywords,
    summary,
    confidence,
  };
}

/**
 * Detect service category from message
 */
function detectCategory(message: string): string {
  const messageLower = message.toLowerCase();
  
  const categories = {
    web_design: ['web', 'site', 'tasarım', 'website', 'arayüz', 'ui', 'ux', 'responsive'],
    digital_marketing: ['pazarlama', 'reklam', 'ads', 'google ads', 'meta', 'facebook', 'instagram', 'sosyal medya', 'kampanya'],
    seo: ['seo', 'arama motoru', 'google', 'sıralama', 'organik', 'backlink', 'keywords'],
    development: ['yazılım', 'uygulama', 'geliştirme', 'kod', 'program', 'sistem', 'entegrasyon', 'api'],
    branding: ['marka', 'logo', 'kimlik', 'brand', 'kurumsal kimlik', 'görsel'],
    digital_transformation: ['dijital dönüşüm', 'otomasyon', 'transformation', 'modernizasyon', 'dijitalleşme'],
    consultancy: ['danışmanlık', 'strateji', 'planlama', 'consultancy', 'yönetim'],
  };
  
  let maxScore = 0;
  let detectedCategory = 'general';
  
  for (const [category, keywords] of Object.entries(categories)) {
    const score = keywords.filter(keyword => messageLower.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      detectedCategory = category;
    }
  }
  
  return detectedCategory;
}

/**
 * Analyze sentiment of message
 */
function analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
  const messageLower = message.toLowerCase();
  
  const positiveWords = [
    'harika', 'mükemmel', 'çok iyi', 'beğendim', 'profesyonel', 'kaliteli', 
    'başarılı', 'teşekkür', 'sevindim', 'mutlu', 'excellent', 'great', 'good',
    'istiyorum', 'talep', 'proje', 'birlikte', 'çalışmak'
  ];
  
  const negativeWords = [
    'kötü', 'başarısız', 'problem', 'sorun', 'şikayet', 'memnun değil',
    'bad', 'poor', 'terrible', 'disappointed', 'issue'
  ];
  
  const positiveScore = positiveWords.filter(word => messageLower.includes(word)).length;
  const negativeScore = negativeWords.filter(word => messageLower.includes(word)).length;
  
  if (positiveScore > negativeScore && positiveScore > 0) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
}

/**
 * Detect priority level
 */
function detectPriority(message: string, sentiment: string): 'high' | 'medium' | 'low' {
  const messageLower = message.toLowerCase();
  
  const urgentWords = [
    'acil', 'hemen', 'urgent', 'asap', 'bugün', 'yarın', 'emergency',
    'çok önemli', 'kritik', 'immediately', 'şimdi', 'en kısa sürede'
  ];
  
  const highPriorityIndicators = [
    'büyük proje', 'enterprise', 'kurumsal', 'yüksek bütçe', 'yatırım',
    'şirket', 'firma', 'holding', 'group'
  ];
  
  // Check for urgent words
  if (urgentWords.some(word => messageLower.includes(word))) {
    return 'high';
  }
  
  // Check for high priority indicators
  if (highPriorityIndicators.some(indicator => messageLower.includes(indicator))) {
    return 'high';
  }
  
  // Positive sentiment with specific requests
  if (sentiment === 'positive' && (messageLower.includes('proje') || messageLower.includes('teklif'))) {
    return 'medium';
  }
  
  // Long, detailed messages indicate serious interest
  if (message.length > 300) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Estimate budget range
 */
function estimateBudget(message: string, company: string | undefined): 'low' | 'medium' | 'high' | 'enterprise' {
  const messageLower = message.toLowerCase();
  
  const enterpriseIndicators = [
    'kurumsal', 'enterprise', 'holding', 'group', 'şirket grubu',
    'büyük proje', 'yatırım', 'kapsamlı'
  ];
  
  const highBudgetIndicators = [
    'profesyonel', 'kaliteli', 'detaylı', 'özel tasarım', 'custom',
    'entegrasyon', 'e-ticaret', 'yazılım geliştirme'
  ];
  
  const lowBudgetIndicators = [
    'basit', 'küçük', 'hızlı', 'uygun fiyat', 'bütçe', 'ekonomik',
    'simple', 'small', 'cheap', 'affordable'
  ];
  
  // Check for enterprise indicators
  if (company || enterpriseIndicators.some(indicator => messageLower.includes(indicator))) {
    return 'enterprise';
  }
  
  // Check for high budget indicators
  if (highBudgetIndicators.some(indicator => messageLower.includes(indicator))) {
    return 'high';
  }
  
  // Check for low budget indicators
  if (lowBudgetIndicators.some(indicator => messageLower.includes(indicator))) {
    return 'low';
  }
  
  return 'medium';
}

/**
 * Extract key keywords from message
 */
function extractKeywords(message: string): string[] {
  const messageLower = message.toLowerCase();
  
  const allKeywords = [
    'web', 'website', 'site', 'tasarım', 'design',
    'seo', 'google', 'reklam', 'ads', 'pazarlama',
    'sosyal medya', 'instagram', 'facebook', 'linkedin',
    'e-ticaret', 'e-commerce', 'wordpress', 'kurumsal',
    'marka', 'logo', 'kimlik', 'yazılım', 'uygulama',
    'mobil', 'responsive', 'modern', 'profesyonel',
    'strateji', 'danışmanlık', 'analiz', 'optimizasyon'
  ];
  
  const foundKeywords = allKeywords.filter(keyword => 
    messageLower.includes(keyword)
  );
  
  return foundKeywords.slice(0, 10); // Limit to top 10
}

/**
 * Generate AI summary
 */
function generateSummary(name: string, category: string, message: string): string {
  const categoryNames: Record<string, string> = {
    web_design: 'Web Tasarım',
    digital_marketing: 'Dijital Pazarlama',
    seo: 'SEO',
    development: 'Yazılım Geliştirme',
    branding: 'Marka Kimliği',
    digital_transformation: 'Dijital Dönüşüm',
    consultancy: 'Danışmanlık',
    general: 'Genel',
  };
  
  const categoryName = categoryNames[category] || 'Genel';
  const messagePreview = message.substring(0, 100);
  
  return `${name}, ${categoryName} konusunda ilgi gösteriyor. Mesaj: "${messagePreview}${message.length > 100 ? '...' : ''}"`;
}

/**
 * Calculate confidence score
 */
function calculateConfidence(message: string): number {
  let confidence = 0.5; // Base confidence
  
  // More detailed messages = higher confidence
  if (message.length > 200) confidence += 0.2;
  if (message.length > 500) confidence += 0.1;
  
  // Structured messages = higher confidence
  const sentences = message.split(/[.!?]/).filter(s => s.trim().length > 0);
  if (sentences.length > 3) confidence += 0.1;
  
  // Contact info = higher confidence
  if (message.includes('@')) confidence += 0.05;
  if (/\d{10,}/.test(message)) confidence += 0.05;
  
  return Math.min(confidence, 1.0);
}

/**
 * Get analytics insights for dashboard
 */
export interface AnalyticsSummary {
  totalSubmissions: number;
  byCategory: Record<string, number>;
  bySentiment: Record<string, number>;
  byPriority: Record<string, number>;
  byBudget: Record<string, number>;
  conversionRate: number;
  averageConfidence: number;
}

/**
 * Generate insights from submissions
 */
export function generateAnalyticsInsights(submissions: Array<{
  aiCategory?: string | null;
  aiSentiment?: string | null;
  aiPriority?: string | null;
  aiEstimatedBudget?: string | null;
  aiConfidence?: number | null;
  status?: string;
}>): AnalyticsSummary {
  const summary: AnalyticsSummary = {
    totalSubmissions: submissions.length,
    byCategory: {},
    bySentiment: {},
    byPriority: {},
    byBudget: {},
    conversionRate: 0,
    averageConfidence: 0,
  };
  
  let totalConfidence = 0;
  let convertedCount = 0;
  
  submissions.forEach(sub => {
    // Count by category
    if (sub.aiCategory) {
      summary.byCategory[sub.aiCategory] = (summary.byCategory[sub.aiCategory] || 0) + 1;
    }
    
    // Count by sentiment
    if (sub.aiSentiment) {
      summary.bySentiment[sub.aiSentiment] = (summary.bySentiment[sub.aiSentiment] || 0) + 1;
    }
    
    // Count by priority
    if (sub.aiPriority) {
      summary.byPriority[sub.aiPriority] = (summary.byPriority[sub.aiPriority] || 0) + 1;
    }
    
    // Count by budget
    if (sub.aiEstimatedBudget) {
      summary.byBudget[sub.aiEstimatedBudget] = (summary.byBudget[sub.aiEstimatedBudget] || 0) + 1;
    }
    
    // Calculate confidence
    if (sub.aiConfidence) {
      totalConfidence += sub.aiConfidence;
    }
    
    // Count conversions
    if (sub.status === 'converted') {
      convertedCount++;
    }
  });
  
  summary.averageConfidence = submissions.length > 0 ? totalConfidence / submissions.length : 0;
  summary.conversionRate = submissions.length > 0 ? (convertedCount / submissions.length) * 100 : 0;
  
  return summary;
}

