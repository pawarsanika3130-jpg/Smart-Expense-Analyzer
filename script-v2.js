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

        // ==========================
        // TABLE
        // ==========================

        let table = "";

        expenses.forEach(item => {

            let voiceButton =
                "No Audio";

            if (item.Audio_URL) {

                voiceButton = `
                <button
                    class="voice-btn"
                    onclick="playVoice('${item.Audio_URL}')">
                    Play Voice
                </button>
                `;

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