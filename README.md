[README.md](https://github.com/user-attachments/files/32440274/README.md)
# India Budget Analyzer

A small web app that compares monthly living costs across Indian cities and shows how much you could save on your income. I made it as a mini project for the Web Development course.

## What it does

* You enter your monthly in hand income (the salary you actually receive after deductions).
* You pick a housing type: 1 BHK, 2 BHK or 3 BHK. BHK stands for Bedroom, Hall, Kitchen.
* You pick up to 3 cities out of 14 and compare them side by side.
* For each city it shows an estimated monthly cost split into housing, food and groceries, cab and transport, utilities and lifestyle.
* It calculates the estimated savings, gives the city a score out of 100, and shows a recommendation for the best city.
* Optionally, you can enter your own actual expenses. Each city card then shows how much more or less you would spend in every category, and how your real savings compare with the estimate.

## Technologies used

* HTML (HyperText Markup Language) for the structure of the page
* CSS (Cascading Style Sheets) for colours, layout and the mobile friendly design
* JavaScript for all the logic. It reads your inputs, does the calculations and updates the page in the browser

There are no frameworks, no libraries, no backend and no database. Everything runs inside the browser.

## Files

| File | What it is |
| --- | --- |
| `index 1.html` | The main page of the app |
| `script.js` | City data, calculations and all the button and input handling |
| `style.css` | Styling of the page |
| `index2.html` | A separate practice file that prints a star triangle using nested loops. It is not part of the app |

## How to run

1. Keep `index 1.html`, `script.js` and `style.css` together in the same folder.
2. Open `index 1.html` in any browser by double clicking it.

You do not need to install anything or connect to the internet.

## How it works

### City data

Each of the 14 cities has fixed monthly estimates for rent, food, transport, utilities and lifestyle, stored in a list at the top of `script.js`. These are sample values written into the code, not live data. The cities are Bengaluru, Mumbai, Delhi NCR (National Capital Region), Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur, Kochi, Chandigarh, Indore, Lucknow and Goa.

### Housing type

The base rent of a city is treated as the price of a 1 BHK. A 2 BHK costs 1.5 times that and a 3 BHK costs 2 times that.

### Income adjustment

People who earn more usually spend more, so the estimate changes with income:

* Above ₹50,000, 10 percent of the amount above ₹50,000 is added to lifestyle spending.
* Above ₹1,00,000 (one lakh), rent is multiplied by 1.3, food by 1.2 and lifestyle by 1.5.

### Savings

Savings = income minus total estimated expenses. If the expenses are more than the income, savings are shown as 0 and the card says "In debt".

### Score out of 100

The score depends on how much money is left after expenses:

| Money left | Score |
| --- | --- |
| Income is 0 | 0 |
| Less than 0 (expenses more than income) | 10 |
| Less than 10 percent of income | 30 |
| 10 to 20 percent of income | 50 |
| 20 to 40 percent of income | 75 |
| 40 percent or more | 90 plus a small bonus, up to 100 |

The score badge changes colour: green above 75, blue above 50, yellow above 30 and red otherwise.

### Recommendation

The city with the highest score is treated as the best one. If its score is above 50, it is highlighted as your best option. If not, a warning message says living there might be difficult.

### Comparing with your actual expenses

Click "Add Your Actual Expenses for Comparison" to open the extra section. It has dropdowns for housing, food, transport, utilities and lifestyle, from ₹0 up to ₹1,00,000 (₹2,00,000 for lifestyle) in steps of ₹500.

If you fill in at least one actual expense, any category you leave at 0 is also left out of the city estimate. This keeps the comparison fair, so you are comparing the same things on both sides.

### Number format

Amounts are shown in the Indian style (for example 1,00,000) using JavaScript's `toLocaleString("en-IN")`.

## Limitations

* City costs are fixed estimates and are not updated automatically.
* Only 14 cities are included.
* Nothing is saved. Refreshing the page resets everything.

## Ideas to improve it

* Get real cost data from an API (Application Programming Interface) instead of typing values into the code
* Add a shared room or PG option. The rent calculation for it already exists in `script.js`, only the button is missing
* Save the last inputs in the browser
* Add more cities and more expense categories

## Author

* Name:
* Course: Web Development
* College:
* Semester:
