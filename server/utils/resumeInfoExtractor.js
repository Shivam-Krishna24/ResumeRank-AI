

function extractEmail(text) {
    const match = text.match(
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
    );

    return match ? match[0] : "";
}

function extractPhone(text) {
    const match = text.match(
        /(\+91[\s-]?)?[6-9]\d{9}/
    );

    return match ? match[0] : "";
}

function extractName(text) {
    const lines = text.split("\n");

    for (let line of lines) {
        line = line.trim();

        if (
            line.length > 2 &&
            line.length < 40 &&
            !line.includes("@")
        ) {
            return line;
        }
    }

    return "Unknown Candidate";
}

module.exports = {
    extractEmail,
    extractPhone,
    extractName
};