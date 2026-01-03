import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Analyze simple/personal expenses for regular users
export const analyzeSimpleExpenses = async (expenses, month, year, userName) => {
  try {
    if (!expenses || expenses.length === 0) {
      return {
        success: false,
        message: "No expenses found for this period"
      };
    }

    // Prepare expense data
    const expensesData = expenses.map(exp => ({
      amount: exp.amount,
      category: exp.category,
      subcategory: exp.subcategory,
      description: exp.description,
      date: exp.date,
      paymentMethod: exp.paymentMethod,
      tags: exp.tags
    }));

    // Calculate statistics
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Category breakdown
    const categoryBreakdown = {};
    expenses.forEach(exp => {
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
    });

    const prompt = `You are a personal financial advisor analyzing monthly expense data for ${userName}.

**PERIOD:** ${month} ${year}

**PERSONAL EXPENSES SUMMARY:**
- Total Spending: ₹${totalAmount.toLocaleString()}
- Number of Transactions: ${expenses.length}
- Average Transaction: ₹${Math.round(totalAmount / expenses.length).toLocaleString()}

**CATEGORY BREAKDOWN:**
${Object.entries(categoryBreakdown)
  .sort((a, b) => b[1] - a[1])
  .map(([cat, amt]) => `- ${cat}: ₹${amt.toLocaleString()} (${Math.round((amt / totalAmount) * 100)}%)`)
  .join('\n')}

**DETAILED EXPENSES:**
${JSON.stringify(expensesData, null, 2)}

**ANALYSIS REQUIRED:**
1. **Executive Summary** - Brief overview of spending this month
2. **Spending Patterns:**
   - Top 3 spending categories with insights
   - Any unusual or concerning expenses
   - Comparison with typical spending habits
3. **Budget Analysis:**
   - Which categories exceeded expected spending
   - Areas where spending was controlled well
4. **Savings Opportunities:**
   - Specific areas to cut costs
   - Recommendations for reducing unnecessary expenses
5. **Actionable Recommendations:**
   - 3-5 practical tips to improve financial health
   - Budget suggestions for next month
   - Warning signs if any

Please provide a detailed, encouraging, and actionable analysis suitable for an email report. Use clear sections with emojis and headings. Be specific with numbers and percentages.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a friendly personal financial advisor. Provide detailed, encouraging, and actionable insights for personal expense management. Use a warm tone while being professional."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    return {
      success: true,
      analysis: response.choices[0].message.content,
      stats: {
        total: totalAmount,
        count: expenses.length,
        categoryBreakdown
      }
    };
  } catch (error) {
    console.error("Simple Expense Analyzer error:", error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Analyze transport/trip expenses for transport business owners
export const analyzeTransportExpenses = async (trips, month, year, userName) => {
  try {
    if (!trips || trips.length === 0) {
      return {
        success: false,
        message: "No trips found for this period"
      };
    }

    // Prepare trip data
    const tripsData = trips.map(trip => ({
      vehicleNumber: trip.Vehicle_Number,
      route: trip.route,
      tripDate: trip.tripDate,
      totalIncome: trip.totalIncome,
      fuelCost: trip.fuelCost,
      driverSalary: trip.driverAllowance?.totalSalary || 0,
      driverBonus: trip.driverAllowance?.bonus || 0,
      driverPaid: trip.driverAllowance?.paid || 0,
      hamaali: trip.hamaali,
      paidTransport: trip.paidTransport,
      toll: trip.toll,
      maintenanceAndRepair: trip.maintenanceAndRepair,
      miscellaneous: trip.miscellaneous,
      totalExpenses: trip.Total_Expenses,
      netProfit: trip.netProfit
    }));

    // Calculate totals
    const totalIncome = trips.reduce((sum, trip) => sum + trip.totalIncome, 0);
    const totalExpenses = trips.reduce((sum, trip) => sum + trip.Total_Expenses, 0);
    const totalProfit = trips.reduce((sum, trip) => sum + trip.netProfit, 0);
    const totalFuel = trips.reduce((sum, trip) => sum + trip.fuelCost, 0);
    const totalMaintenance = trips.reduce((sum, trip) => sum + trip.maintenanceAndRepair, 0);
    
    // Route analysis
    const routeStats = {};
    trips.forEach(trip => {
      if (!routeStats[trip.route]) {
        routeStats[trip.route] = { count: 0, income: 0, expenses: 0, profit: 0 };
      }
      routeStats[trip.route].count++;
      routeStats[trip.route].income += trip.totalIncome;
      routeStats[trip.route].expenses += trip.Total_Expenses;
      routeStats[trip.route].profit += trip.netProfit;
    });

    const profitMargin = ((totalProfit / totalIncome) * 100).toFixed(2);

    const prompt = `You are a transport business consultant analyzing monthly performance for ${userName}'s transport business.

**PERIOD:** ${month} ${year}

**BUSINESS PERFORMANCE SUMMARY:**
- Total Income: ₹${totalIncome.toLocaleString()}
- Total Expenses: ₹${totalExpenses.toLocaleString()}
- Net Profit: ₹${totalProfit.toLocaleString()}
- Profit Margin: ${profitMargin}%
- Number of Trips: ${trips.length}

**EXPENSE BREAKDOWN:**
- Fuel Costs: ₹${totalFuel.toLocaleString()} (${Math.round((totalFuel / totalExpenses) * 100)}%)
- Maintenance: ₹${totalMaintenance.toLocaleString()} (${Math.round((totalMaintenance / totalExpenses) * 100)}%)

**ROUTE PERFORMANCE:**
${Object.entries(routeStats)
  .sort((a, b) => b[1].profit - a[1].profit)
  .map(([route, stats]) => `- ${route}: ${stats.count} trips, Profit: ₹${stats.profit.toLocaleString()} (Margin: ${((stats.profit/stats.income)*100).toFixed(1)}%)`)
  .join('\n')}

**DETAILED TRIP DATA:**
${JSON.stringify(tripsData, null, 2)}

**ANALYSIS REQUIRED:**
1. **Executive Summary** - Overall business health this month
2. **Profitability Analysis:**
   - Best and worst performing routes
   - Profit margin trends
   - Income vs expense ratio analysis
3. **Cost Efficiency:**
   - Fuel efficiency insights
   - Maintenance cost patterns
   - Driver payment optimization
   - Toll and miscellaneous expense review
4. **Route Optimization:**
   - Which routes to focus on
   - Which routes need review or discontinuation
   - Frequency recommendations per route
5. **Operational Recommendations:**
   - Cost-cutting opportunities without compromising quality
   - Revenue optimization strategies
   - Fleet management suggestions
6. **Action Plan:**
   - 3-5 specific steps to improve profitability
   - Risk factors to monitor
   - Growth opportunities

Please provide a detailed, professional business analysis suitable for an email report. Use clear sections with headings. Be specific with numbers, percentages, and ROI. Focus on actionable business insights.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional transport business consultant specializing in fleet management and logistics. Provide detailed, data-driven insights focused on profitability, efficiency, and business growth."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return {
      success: true,
      analysis: response.choices[0].message.content,
      stats: {
        totalIncome,
        totalExpenses,
        totalProfit,
        profitMargin: parseFloat(profitMargin),
        tripCount: trips.length,
        routeStats
      }
    };
  } catch (error) {
    console.error("Transport Expense Analyzer error:", error);
    return {
      success: false,
      message: error.message
    };
  }
};

export default client;
