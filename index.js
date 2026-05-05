
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

// Financial news samples for demonstration
const sampleFinancialNews = [
  "Tech stocks surge as AI companies report record quarterly earnings and announce major innovations.",
  "Market drops sharply following unexpected interest rate hike announcement from the Federal Reserve.",
  "Apple announces record profits amid strong iPhone sales in emerging markets.",
  "Banking sector struggles as several major institutions face regulatory scrutiny.",
  "Tesla stock rallies after CEO announces ambitious expansion plans for European factories.",
  "Oil prices plummet due to increased production from OPEC+ members.",
  "Cryptocurrency market stabilizes following months of volatility and regulatory concerns.",
  "Amazon reports disappointing earnings missing analyst expectations by 15%.",
  "Gold reaches new all-time high amid economic uncertainty and inflation concerns.",
  "Healthcare sector outperforms as new drug approvals boost investor confidence.",
];

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

class FinancialSentimentAnalyzer {
  private conversationHistory: ConversationMessage[] = [];
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private async analyzeNewsSentiment(news: string): Promise<string> {
    const userMessage = `Analyze the sentiment of this financial news headline: "${news}"
    
    Provide:
    1. Sentiment classification (Positive/Negative/Neutral)
    2. Sentiment score (-1.0 to 1.0)
    3. Key drivers of the sentiment
    4. Potential market impact (High/Medium/Low)
    5. Affected sectors or asset classes`;

    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: `You are an expert financial sentiment analyst. Analyze financial news with precision and provide structured insights about market sentiment, potential impacts, and affected sectors. Always be clear, concise, and professional in your analysis.`,
      messages: this.conversationHistory,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    this.conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    return assistantMessage;
  }

  private async generateMarketSummary(): Promise<string> {
    const userMessage =
      "Based on our sentiment analysis of the financial news discussed, provide a comprehensive market sentiment summary. Include: overall market outlook, key trends, risk factors, and investment implications.";

    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      system: `You are an expert financial sentiment analyst. Analyze financial news with precision and provide structured insights about market sentiment, potential impacts, and affected sectors. Always be clear, concise, and professional in your analysis.`,
      messages: this.conversationHistory,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    this.conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    return assistantMessage;
  }

  private async answerUserQuestion(question: string): Promise<string> {
    this.conversationHistory.push({
      role: "user",
      content: question,
    });

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: `You are an expert financial sentiment analyst with deep knowledge of market dynamics. Answer questions about financial sentiment analysis, market trends, and investment implications. Maintain context from previous analyses in the conversation.`,
      messages: this.conversationHistory,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    this.conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    return assistantMessage;
  }

  private prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer: string) => {
        resolve(answer);
      });
    });
  }

  async run(): Promise<void> {
    console.log("\n🔍 Financial News Sentiment Analysis Bot");
    console.log("=========================================\n");
    console.log("This bot analyzes sentiment in financial news headlines.");
    console.log("It maintains conversation context for deeper insights.\n");

    console.log("📰 Analyzing sample financial news headlines...\n");

    // Analyze a subset of sample news
    const newsToAnalyze = sampleFinancialNews.slice(0, 3);

    for (const news of newsToAnalyze) {
      console.log(`\n📰 News: "${news}"`);
      console.log("Analyzing sentiment...\n");

      const analysis = await this.analyzeNewsSentiment(news);
      console.log("Analysis:");
      console.log(analysis);
      console.log("\n" + "=".repeat(70));
    }

    // Generate comprehensive market summary
    console.log("\n📊 Generating Market Sentiment Summary...\n");
    const summary = await this.generateMarketSummary();
    console.log("Market Summary:");
    console.log(summary);
    console.log("\n" + "=".repeat(70));

    // Interactive Q&A
    console.log("\n💬 Interactive Mode");
    console.log("Ask questions about the analyzed news and market sentiment.");
    console.log('