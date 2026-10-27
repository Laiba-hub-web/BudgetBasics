/* BudgetBasics content. Add new tips, questions or answers here; app.js needs no changes. */
const DATA = {
  /* Edit this block: contact details, socials and creator names update everywhere (Contact, About, footer). */
  site: {email:"hello@budgetbasics.example", phone:"+92 300 0000000", address:"Karachi, Pakistan", creators:"Your Name, Aptech Web Innovation Unleashed",
    socials:[["Instagram","https://www.instagram.com/"],["Facebook","https://www.facebook.com/"],["YouTube","https://www.youtube.com/"]]},
  mods: [["dashboard","Monthly Dashboard","Income, expenses, savings and balance at a glance."],["basics","Budgeting Basics","Six core ideas and a sample student budget."],["needs","Needs vs Wants","Sort items and get instant feedback."],["rule","50-30-20 Rule","Split any allowance in one click."],["goals","Savings Goals","See how many months your goal needs."],["planner","Budget Simulator","Plan your salary and log daily spending."],["challenge","Daily Saving Challenge","7-day and 30-day habit trackers."],["wallet","Wallet Demo","A mock wallet screen (sample data only)."],["mistakes","Money Mistakes","Real scenarios with quick fixes."],["infographics","Infographics","Visual lessons you can filter."],["chatbot","AI Chatbot","Ask BudgetBee a quick question."]],
  ticker: [
    "A budget tells your money where to go instead of wondering where it went.",
    "Rs 200 a day on small spends is Rs 6,000 in a 30-day month.",
    "Pay yourself first: set savings aside before you spend.",
    "Wait 48 hours before any non-essential purchase."
  ],
  facts: [
    "A budget is a plan, not a punishment.",
    "Rs 100 saved every day becomes Rs 3,000 in a 30-day month.",
    "Needs are what you must pay to study and live. Wants can wait.",
    "Starting small still counts. The habit matters more than the amount."
  ],
  tips: [
    {t:"Pay yourself first", topic:"saving", d:"Move your savings aside on the day money arrives, then spend what is left."},
    {t:"Track the small stuff", topic:"expenses", d:"Snacks and rides look tiny alone. Write them down for one week and add them up."},
    {t:"Name your goal", topic:"goals", d:"'Laptop bag in 4 months' is easier to save for than 'save more'."},
    {t:"Needs before wants", topic:"needs", d:"Cover fees, food and transport first. Wants come from what remains."},
    {t:"Wait 48 hours", topic:"expenses", d:"If you still want it after two days, it is more likely a real want than an impulse."},
    {t:"Start an emergency pot", topic:"saving", d:"Even Rs 500 a month builds a cushion for a cracked phone screen."},
    {t:"Cancel what you don't use", topic:"expenses", d:"Check subscriptions monthly. Unused ones quietly drain your wants budget."},
    {t:"Round up your saving", topic:"goals", d:"Planned Rs 1,850? Set aside Rs 2,000 and reach your goal sooner."}
  ],
  concepts: [
    ["Income","Money coming in: allowance, scholarship or part-time pay.","Example: Rs 20,000 a month"],
    ["Fixed expenses","Costs that stay the same each month.","Example: hostel share Rs 4,000"],
    ["Variable expenses","Costs that change month to month.","Example: food Rs 2,000 to 3,000"],
    ["Requirements (needs)","Things you must pay for to study and live.","Example: bus pass, fees"],
    ["Wants","Nice to have, but you can wait.","Example: streaming, outings"],
    ["Savings","Money set aside for later goals and surprises.","Example: emergency fund"]
  ],
  income: [["Monthly allowance",15000],["Tutoring income",5000]],
  budget: [
    ["Hostel share","Need","Fixed",4000],["Transport","Need","Fixed",2500],["Internet","Need","Fixed",1000],["Food","Need","Variable",2500],
    ["Snacks and outings","Want","Variable",2500],["Streaming","Want","Fixed",1000],["Shopping","Want","Variable",2500],
    ["Emergency fund","Saving","Fixed",2500],["Goal fund","Saving","Fixed",1500]
  ],
  quiz: [
    {q:"Which is usually a variable expense?", o:["Monthly hostel share","Snacks and outings","Fixed internet plan"], a:1, why:"Snacks and outings change every month. Rent and fixed plans do not."},
    {q:"Income is Rs 10,000. How much goes to savings in the 50-30-20 guideline?", o:["Rs 1,000","Rs 2,000","Rs 3,000"], a:1, why:"20% of Rs 10,000 is Rs 2,000."}
  ],
  items: [
    ["Monthly bus pass",true,"You need it to reach class, so it is a need."],
    ["Course textbook",true,"Study material is a need."],
    ["Basic lunch",true,"Food is a need. A basic meal, not a restaurant meal."],
    ["Internet for coursework",true,"Reliable study internet is a need."],
    ["New sneakers while the old pair works",false,"The old pair still works, so this is a want."],
    ["Streaming subscription",false,"Fun, but optional. It is a want."],
    ["Weekend cafe outing",false,"Enjoyable and optional, so a want."],
    ["Latest phone upgrade",false,"Your phone works. An upgrade is a want to save for."]
  ],
  mistakes: [
    {t:"Impulse buying", p:"Buying something on the spot, without planning, because it feels good in the moment.", s:"Sara sees a Rs 3,500 jacket on sale and buys it in two minutes.", why:"Sales and social pressure create urgency, and the brain enjoys the instant reward of buying.", fix:"Add it to a wish list and wait 48 hours. Buy only from your wants budget."},
    {t:"Ignoring small expenses", p:"Small daily purchases feel harmless one at a time, but add up fast.", s:"Ali buys a Rs 150 drink daily and never notices the Rs 4,500 a month.", why:"Small amounts do not feel significant in the moment, so they are rarely tracked.", fix:"Track every spend for one week, then set a small weekly limit."},
    {t:"Late payments", p:"Missing a due date turns a normal bill into an avoidable extra cost.", s:"Hina forgets her phone bill and pays a late charge.", why:"Without a reminder system, due dates are easy to lose track of during a busy week.", fix:"Set a reminder three days before every due date."},
    {t:"Unused subscriptions", p:"Recurring charges for services that are rarely or never used.", s:"Omar pays for three apps but uses only one.", why:"Subscriptions renew automatically and are easy to forget about once signed up.", fix:"Review subscriptions monthly and cancel what you skipped this month."},
    {t:"Spending without a plan", p:"Spending as needs arise, with no monthly plan to follow.", s:"Zain's allowance is gone by the 15th.", why:"Without a budget, the biggest or most exciting expenses get paid first, leaving nothing for later.", fix:"Divide the month into needs, wants and savings before spending anything."},
    {t:"Spending the whole allowance quickly", p:"Treating allowance day as a reason to spend freely right away.", s:"Bilal's allowance arrives and half is gone within 24 hours on eating out.", why:"A lump sum feels larger than it is until it is divided across the month.", fix:"Split your allowance into weekly amounts on the day it arrives."},
    {t:"Saving whatever is left over", p:"Treating savings as an afterthought instead of a planned amount.", s:"Mariam plans to save \u201cwhatever is left\u201d at month end, and it is usually nothing.", why:"When savings come last, wants and small expenses use up the money first.", fix:"Move savings out on day one, before any spending, even a small fixed amount."},
    {t:"Buying because of a discount", p:"Treating a sale price as a reason to buy something not actually needed.", s:"Usman buys a second jacket because it is 40% off, though he did not plan to buy one.", why:"A discount feels like a gain, even when the purchase itself was never necessary.", fix:"Ask first: would I buy this at full price? If not, the discount does not make it a need."}
  ],
  info: [
    {id:"needs", topic:"needs", title:"Needs vs Wants", alt:"Two columns: needs such as bus pass and textbook, wants such as streaming and outings.", cap:"Needs keep you going. Wants can wait."},
    {id:"split", topic:"budgeting", title:"The 50-30-20 split", alt:"A bar split into 50% needs, 30% wants and 20% savings.", cap:"A guideline you can adjust."},
    {id:"cycle", topic:"budgeting", title:"Monthly budget cycle", alt:"Four steps in a loop: earn, plan, spend, review.", cap:"Review every month and improve."},
    {id:"challenge", topic:"saving", title:"Saving challenge", alt:"Bars growing each week from Rs 100 to Rs 600 saved.", cap:"Save Rs 100 more each week."}
  ],
  bot: [
    {k:["50-30-20","50/30/20","rule"], a:"The 50-30-20 rule splits income into 50% needs, 30% wants and 20% savings. Adjust it to fit your life."},
    {k:["need"], a:"A need is something you must pay for to live and study, like food, transport, fees and study internet."},
    {k:["want"], a:"A want is nice to have but can wait, like streaming, outings or new gadgets."},
    {k:["save","saving"], a:"Try saving around 20% of your income. If that is hard, start with any small amount and grow it. Pay yourself first."},
    {k:["overspend","spending","spend"], a:"To avoid overspending: track expenses, set a monthly plan, wait 48 hours before non-essential buys, and check subscriptions."},
    {k:["budget"], a:"A budget is a plan for your money: list income, then assign it to needs, wants and savings."},
    {k:["emergency"], a:"An emergency fund is money kept for surprises like repairs. Even Rs 500 a month is a good start."},
    {k:["goal"], a:"Set a goal name, target and monthly amount. Divide what remains by your monthly amount to estimate the months."},
    {k:["impulse"], a:"Beat impulse buying with a 48-hour wait and a written wish list."}
  ],
  botFallback: "I can answer budgeting questions and check purchases against your own numbers, for example: Can I afford shoes for 3000? or How much can I spend today? I cannot answer general questions such as directions or news, because this site works offline without an AI service.",
  prompts: ["What is a need?","How much should I save?","How do I avoid overspending?","How much can I spend today?","Can I afford shoes for 3000?","Where did my money go?"],
  habits: {
    "Buying snacks every day":"Set a weekly snack limit in cash and stop when it is gone. Small daily spends add up fast.",
    "Unused subscriptions":"List every subscription and cancel the ones you did not use this month.",
    "Impulse online shopping":"Move items to a wish list and wait 48 hours before paying.",
    "Money runs out mid-month":"Split your allowance into four weekly amounts so it lasts to the end of the month.",
    "I never track spending":"Try the Budget Simulator for one week. Seeing the total is the first step to control."
  }
};

/* ---- v3 content: videos (Mixkit free stock, mp4 links), gallery tiles, glossary, checklist, extra text ---- */
DATA.mods.push(["videos","Video Lessons","Short clips with key takeaways."],["gallery","Picture Gallery","Tap a picture for a tip."]);
DATA.videos = [
  {id:23524,p:2,t:"Give every rupee a job",l:"The heart of budgeting: divide your money into envelopes for needs, wants and savings before you spend it.",k:["Split money before spending","Use separate envelopes or wallets","Review at month end"]},
  {id:18302,p:0,t:"Sort, count and calculate",l:"Sort what you have, write it in a notebook and total it with a calculator. That is all you need to start.",k:["Write income and costs down","Group by type","Check totals weekly"]},
  {id:47014,p:2,t:"Small amounts add up",l:"Coins falling over a calculator: small daily savings become real money over a month.",k:["Rs 100 a day is Rs 3,000 a month","Save first, spend the rest","Consistency beats size"]},
  {id:46979,p:2,t:"Time is money",l:"Pay bills on time and start saving early. Late fees cost you and early saving grows your cushion.",k:["Set bill reminders","Start now, even small","Avoid late charges"]},
  {id:18299,p:0,t:"When the wallet runs empty",l:"What happens without a plan: money runs out before the month does. A simple budget prevents this.",k:["Plan the whole month","Keep an emergency pot","Track spending weekly"]},
  {id:18263,p:0,t:"Even coins count",l:"Collect loose change in a jar and add it to a savings goal. Small habits build big results.",k:["Use a coin jar","Deposit it monthly","Give the jar a goal"]}
];
DATA.gallery = [
  ["🪴","Savings goal","Drop in coins daily. A visible jar makes saving feel real.","#0f5c6e","#0a2f3a"],
  ["\u{1F45B}","Wallet check","Count your cash every Sunday so surprises never happen.","#8a5a00","#5c3b00"],
  ["\u{1F68C}","Transport pass","A monthly pass is often cheaper than daily rides. A classic need.","#6b3fa0","#3f2a75"],
  ["\u{1F4DA}","Study essentials","Books and fees come first in the needs budget.","#b03a5b","#7a213d"],
  ["\u{1F4F1}","Phone tracker","A notes app is enough to log every spend in seconds.","#1f7a5a","#0f4f3a"],
  ["\u{1F371}","Home lunch","Packing lunch a few days a week can save thousands a month.","#2b6cb0","#1a3f75"],
  ["\u{1F3AF}","Goal jar","Name your goal and stick a picture of it on the jar.","#c05621","#7b341e"],
  ["\u{1F9FE}","Receipt habit","Keep receipts for a week. You will see exactly where money goes.","#2d3748","#0a2f3a"]
];
DATA.glossary = [["Budget","A plan for how you will spend and save your money."],["Income","Money you receive: allowance, pay or scholarship."],["Expense","Money you spend on something."],["Fixed expense","A cost that is the same every month, like a hostel share."],["Variable expense","A cost that changes, like food or snacks."],["Need","Something essential for study and daily life."],["Want","Something nice to have that can wait."],["Savings","Money you keep aside for later."],["Emergency fund","Savings for surprises like repairs or medicine."],["Impulse buy","An unplanned purchase made on the spot."],["Deficit","When you spend more than you earn."],["Surplus","Money left over after all expenses."]];
DATA.checklist = ["Write down my monthly income","List my fixed expenses","Track every spend for one week","Set one savings goal","Start an emergency fund (even Rs 500)","Cancel one unused subscription","Review my budget at month end"];
DATA.desc = {home:"Welcome, tips, video and quick facts",basics:"Core ideas, sample budget, checklist and glossary",needs:"Sort items and use the decision guide",rule:"Split income with 50-30-20 and other styles",mistakes:"Real scenarios and fixes",goals:"Estimate months to reach a goal",planner:"Salary-based simulator with daily tracking",chatbot:"Ask BudgetBee a question",infographics:"Visual lessons with a topic filter",videos:"Short video lessons with takeaways",gallery:"Pictures with quick tips",feedback:"Rate the site and share ideas",about:"Why this site exists",contact:"Get in touch",sitemap:"You are here"};
DATA.dyk = {basics:"People who write their spending down for one week usually find money they did not know they were spending.",needs:"Most impulse purchases feel urgent for less than a day. Waiting helps.",rule:"The 50-30-20 rule is a guideline. Use 60-20-20 or 70-20-10 when costs are high.",goals:"Rounding your monthly saving up by just 10% can shorten a goal by weeks.",planner:"Reviewing your spending once a week is enough to stay in control.",mistakes:"The most common budget mistake is not having a budget at all.",infographics:"Pictures are remembered better than text. Share these with friends.",chatbot:"BudgetBee answers from a fixed script, so it works without internet.",videos:"Watching a short lesson then trying a calculator helps you remember.",gallery:"Small everyday habits shown here matter more than big one-off efforts.",feedback:"Your feedback helps improve the site for every student.",about:"This site is a student project and offers education only.",contact:"We usually reply within two working days (demo).",sitemap:"Every page of the site is listed here."};
DATA.related = {basics:["needs","rule","videos"],needs:["rule","mistakes","planner"],rule:["planner","goals","infographics"],goals:["planner","rule","chatbot"],planner:["rule","goals","mistakes"],mistakes:["basics","videos","chatbot"],infographics:["basics","gallery","videos"],chatbot:["basics","rule","feedback"],videos:["basics","gallery","planner"],gallery:["videos","infographics","basics"],feedback:["contact","about","chatbot"],contact:["about","feedback","sitemap"],about:["contact","feedback","sitemap"],sitemap:["basics","videos","contact"]};

/* ---- v5: Money Lab content ---- */
DATA.mods.push(["lab","Money Lab","Ten interactive tools: decisions, detective, DNA and more."]);
DATA.desc.lab="Ten interactive tools for real money decisions"; DATA.dyk.lab="Good money habits come from good decisions, not only from formulas."; DATA.related.lab=["planner","rule","gallery"];
DATA.related.planner=["lab","rule","goals"];
DATA.scenarios=[
 {t:"Headphones or saving",s:"You have Rs 5,000 left for the month.",budget:5000,o:[{t:"Buy new headphones (Rs 4,000)",spend:4000,save:0,c:"Your cushion for unexpected costs becomes small for the rest of the month."},{t:"Save Rs 3,000 and use Rs 2,000 for necessary expenses",spend:2000,save:3000,c:"You keep a bigger cushion, but you go without the headphones for now."}]},
 {t:"Eating out or cooking",s:"You have Rs 3,000 left for food this month.",budget:3000,o:[{t:"Eat out with friends (Rs 2,800)",spend:2800,save:0,c:"Fun and social, but little is left if something urgent comes up."},{t:"Cook at home (Rs 1,200) and save Rs 1,000",spend:1200,save:1000,c:"More left over, though you may miss some outings."}]},
 {t:"Subscription or free option",s:"You have Rs 2,000 for extras this month.",budget:2000,o:[{t:"Pay Rs 600 for a streaming plan",spend:600,save:0,c:"Convenient, but it repeats every month."},{t:"Use a free alternative and save Rs 600",spend:0,save:600,c:"You give up some features but keep the money."}]},
 {t:"Sale or waiting",s:"A Rs 3,500 jacket is on sale. You have Rs 6,000 spare.",budget:6000,o:[{t:"Buy it now on sale (Rs 3,500)",spend:3500,save:0,c:"A discount still costs money. It only helps if you truly needed it."},{t:"Wait 48 hours and save Rs 2,000 meanwhile",spend:0,save:2000,c:"You may still buy it later, with a clearer mind."}]},
 {t:"Borrowing or delaying",s:"You want a Rs 4,000 gadget but have Rs 1,500 spare.",budget:1500,o:[{t:"Borrow Rs 2,500 and buy it now",spend:1500,save:0,c:"You owe Rs 2,500 and future months carry that repayment."},{t:"Delay and save Rs 1,500 now",spend:0,save:1500,c:"You reach the price later, with no debt."}]}
];
DATA.aid=[
 {ic:"\u{1F534}",t:"I ran out of money",s:["Check what essentials remain: food, transport, study needs.","Stop all non-essential spending right away.","Review payments due in the next days.","Identify any savings you can use, and note it to refill later.","Plan the next month with a limit per day."]},
 {ic:"\u{1F7E0}",t:"Unexpected expense",s:["Stay calm and write down the exact amount.","Use the questions below to decide what to do."],flow:1},
 {ic:"\u{1F4B8}",t:"I spent too much",s:["Add up what you spent this week.","Find the biggest category and the small repeats.","Set a daily limit in the Budget Simulator.","Reduce wants slightly for the next 2 weeks."]},
 {ic:"\u{1F437}",t:"I can't save",s:["Start tiny: Rs 100 a day is Rs 3,000 a month.","Move it out on the day money arrives.","Give the savings a named goal.","Raise the amount a little every month."]},
 {ic:"\u{1F4FA}",t:"Too many subscriptions",s:["List every subscription and its monthly price.","Mark each: yes, sometimes or never used.","Cancel the never-used ones first.","Try the Subscription Graveyard tool."]},
 {ic:"\u{1F6D2}",t:"I keep buying on impulse",s:["Use a 48-hour wait for anything non-essential.","Keep a wish list instead of buying now.","Delete saved cards from shopping apps.","Try the Smart Purchase Pause."]},
 {ic:"\u{1F50E}",t:"I don't know where my money goes",s:["Write down every spend for 7 days.","Run the 7-Day Spending Detective.","Group spending into needs, wants and savings.","Set limits for the biggest category."]},
 {ic:"\u{1F3E0}",t:"A large expense is coming",s:["Write the amount and the date it is due.","Divide the amount by the weeks left to get a weekly amount.","Set that amount aside each week.","Trim wants until the date passes."]}
];
DATA.timeline=[
 {d:"Day 1",i:"\u{1F4B0}",t:"Income received",x:"Your salary or allowance arrives. Split it at once into needs, wants and savings."},
 {d:"Day 3",i:"\u{1F354}",t:"Food spending",x:"Food is a need, but eating out repeatedly can become a hidden want."},
 {d:"Day 7",i:"\u{1F6CD}\uFE0F",t:"Shopping temptation",x:"A sale appears. Use the 48-hour wait before buying anything non-essential."},
 {d:"Day 15",i:"\u{1F4DA}",t:"Education expense",x:"Books and fees are planned needs. Set money aside for them early."},
 {d:"Day 20",i:"\u26A0\uFE0F",t:"Unexpected expense",x:"Surprises happen. A small emergency fund keeps them from becoming a crisis."},
 {d:"Day 30",i:"\u{1F3AF}",t:"Savings review",x:"Compare plan and reality, note mistakes, and set a goal for next month."}
];
DATA.myths=[
 {m:"Saving only matters when you have a lot of money.",r:"Saving can be practiced with small amounts. The amount and how often depend on your situation.",go:"goals",gt:"Try the Savings Goals calculator"},
 {m:"A discount always means I'm saving money.",r:"A discounted item still costs money. A discount does not make a purchase necessary.",go:"lab",gt:"Try the Smart Purchase Pause"},
 {m:"Small expenses don't matter.",r:"Repeated small expenses can add up to a large amount over a month.",go:"lab",gt:"Run the Spending Detective"},
 {m:"Budgeting means I can never have fun.",r:"A budget has a wants share on purpose. It lets you enjoy things without guilt.",go:"rule",gt:"Open the 50-30-20 calculator"},
 {m:"I can start budgeting later when I earn more.",r:"Habits built now with a small allowance carry over when income grows.",go:"planner",gt:"Open the Budget Simulator"},
 {m:"Cash left at month end is money I can spend freely.",r:"Leftover money is a chance to build savings or a cushion first.",go:"planner",gt:"See your safe daily spend"}
];

DATA.bot.push(
 {k:["loan","debt","borrow","udhaar","qarz"],a:"Debt is money you owe. Pay bills on time, avoid borrowing for wants, and if you must borrow, plan the repayment before you take it."},
 {k:["invest","stock","crypto","business"],a:"This site is for budgeting education only and gives no investment advice. A common first step is a small emergency fund before anything else."},
 {k:["salary","income","allowance","earn"],a:"Start with your income: add up everything you receive each month, then divide it into needs, wants and savings. Try the Budget Simulator."},
 {k:["grocery","cook","food cost","lunch"],a:"Cooking or packing lunch a few days a week usually costs far less than eating out. Track food for a week to see the difference."},
 {k:["transport","bus","fuel","petrol"],a:"Transport is often a fixed need. Compare a monthly pass with daily rides, and share rides when you can."},
 {k:["side income","part-time","freelance","extra money"],a:"A part-time job or freelance work can raise your income. Add it to your monthly income in the simulator to see the effect on savings."},
 {k:["thank"],a:"You are welcome! Ask me anything about your budget."}
);

/* ---- v7: dashboard, challenge, wallet, search, tip-of-day, gamification, mini question ---- */
DATA.desc.dashboard="Monthly income, expenses, savings and remaining balance in one dashboard"; DATA.dyk.dashboard="Reviewing your budget once a week catches problems while they are still small."; DATA.related.dashboard=["planner","goals","challenge"];
DATA.desc.challenge="7-day and 30-day daily saving challenges you can tick off"; DATA.dyk.challenge="Habits form faster with a visible streak. Try not to break the chain."; DATA.related.challenge=["planner","goals","dashboard"];
DATA.desc.wallet="A mock wallet screen with sample transactions (demo only, no real account)"; DATA.dyk.wallet="Real budgeting apps use secure official APIs. This demo shows the idea without touching a real account."; DATA.related.wallet=["planner","dashboard","mistakes"];
DATA.related.planner=["dashboard","challenge","rule"]; DATA.related.goals=["challenge","dashboard","rule"];
DATA.months=["January","February","March","April","May","June","July","August","September","October","November","December"];
DATA.wallet=[["Food","Lunch at cafeteria",500],["Transport","Bus fare",200],["Shopping","Stationery",1000],["Utilities","Mobile top-up",300],["Entertainment","Streaming top-up",250]];
DATA.challenge7=[
 "Avoid one unnecessary Rs 100 spend today.",
 "Record every expense you make today, even small ones.",
 "Delay one non-essential purchase by 24 hours.",
 "Cook or pack a meal instead of buying one.",
 "Move a fixed amount into savings before spending anything else.",
 "Cancel or review one subscription you rarely use.",
 "Review the whole week: what worked, what did not?"
];
DATA.challenge30tips=["Track every rupee today.","Skip one small treat and note the saving.","Compare two prices before buying something.","Wait 24 hours on a non-essential want.","Move money to savings before spending.","Pack a meal instead of buying one.","Review your spending from the last 3 days.","Say no to one impulse purchase.","Check for an unused subscription.","Round up a saving to the next Rs 50.","Plan tomorrow's essential spending tonight.","Avoid app-based delivery fees today.","Reuse or repair instead of buying new.","Halfway check: are you still within budget?","Share a saving tip with a friend.","Set a Rs 100 limit for extras today.","Skip one ride and walk if it is safe and close.","Add any loose change to a savings jar.","Review your biggest expense category.","Try a no-spend day.","Compare your spending to last week.","Write down one thing you did not need to buy.","Check your progress toward your savings goal.","Plan a low-cost weekend activity.","Avoid one impulse online browse-and-buy.","Give your savings a percentage boost today.","Review upcoming bills for the next week.","Note one budgeting lesson you learned this month.","Almost there: keep the streak going.","Celebrate finishing the challenge, then set a new goal!"];
