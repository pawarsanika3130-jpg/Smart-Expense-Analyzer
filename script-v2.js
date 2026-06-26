console.log("SMART EXPENSE ANALYZER V5");

const API_URL =
"https://np6bjr8cok.execute-api.ap-south-1.amazonaws.com";


// ===================================
// FORMAT INR
// ===================================

function formatINR(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0
        }
    ).format(amount);

}


// ===================================
// PLAY AUDIO
// ===================================

function playVoice(audioUrl) {

    console.log("Playing:", audioUrl);

    if (!audioUrl) {

        alert("Audio not available");

        return;
    }

    const audio = new Audio(audioUrl);

    audio.play()
        .then(() => {

            console.log("Audio Started");

        })
        .catch(error => {

            console.error(
                "Audio Error:",
                error
            );

        });

}


// ===================================
// LOAD DASHBOARD
// ===================================

async function loadDashboard() {

    try {

        console.log("calling api...");

        const response =
            await fetch(`${API_URL}/expenses`);

        console.log(
            "status:",
            response.status
        );

        if (!response.ok) {

            throw new Error(
                "Failed to load data"
            );

        }

        const expenses =
            await response.json();

        console.log(
            "Expenses:",
            expenses
        );

        // ==========================
        // TOTAL EXPENSE
        // ==========================

        let total = 0;

        expenses.forEach(item => {

            total += parseInt(
                item.Amount || 0
            );

        });

        document.getElementById(
            "totalExpense"
        ).innerHTML =
            formatINR(total);

        // ==========================
        // TOTAL BILLS
        // ==========================

        document.getElementById(
            "totalBills"
        ).innerHTML =
            expenses.length;
        let monthlyTotal = 0;

          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

           expenses.forEach(item => {

           const expenseDate = new Date(item.Date);

    if (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
    ) {
        monthlyTotal += parseInt(item.Amount || 0);
    }

});

document.getElementById("monthlyExpense").innerHTML =
    formatINR(monthlyTotal);

        // ==========================
        // LATEST EXPENSE
        // ==========================

        if (expenses.length > 0) {

            document.getElementById(
                "latestExpense"
            ).innerHTML =
                formatINR(
                    expenses[0].Amount
                );

        }
            let dateTotals = {};

expenses.forEach(item => {

    const date = item.Date;

    if (!dateTotals[date]) {
        dateTotals[date] = 0;
    }

    dateTotals[date] += parseInt(item.Amount || 0);

});

let summaryTable = "";

for (const date in dateTotals) {

    summaryTable += `
    <tr>
        <td>${date}</td>
        <td>${formatINR(dateTotals[date])}</td>
    </tr>`;
}

document.getElementById("dateSummaryTable").innerHTML =
    summaryTable;

        // ==========================
        // TABLE
        // ==========================

        let table = "";

        expenses.forEach(item => {

            let voiceButton =
                "No Audio";

            if (item.Audio_URL) {

               
            

            }

            table += `
            <tr>
                <td>${item.Bill_Id}</td>
                <td>${formatINR(item.Amount)}</td>
                <td>${voiceButton}</td>
            </tr>
            `;

        });

        document.getElementById(
            "expenseTable"
        ).innerHTML =
            table;

    }
    catch(error) {

        console.error(
            "ERROR:",
            error
        );

        document.getElementById(
            "totalExpense"
        ).innerHTML =
            "Error";

        document.getElementById(
            "totalBills"
        ).innerHTML =
            "Error";

        document.getElementById(
            "latestExpense"
        ).innerHTML =
            "Error";
    }

}


// ===================================
// START APP
// ===================================

loadDashboard();
