export const parseBoletoText = (text: string) => {
    // Basic regex patterns for Brazilian boletos
    // Note: Accurate parsing requires complex logic (Mod 10/11) and library support (e.g. boleto.js).
    // This is a simplified heuristic demo.

    const lines = text.split('\n')
    let barcode = ""
    let amount = 0
    let dueDate: Date | null = null

    // Attempt to find digit line (approximate pattern: 47-48 digits, often grouped)
    const digitLineMatch = text.match(/(\\d{5}\\.?\\d{5} \\d{5}\\.?\\d{6} \\d{5}\\.?\\d{6} \\d \\d{14})/);
    if (digitLineMatch) {
        barcode = digitLineMatch[0]
    }

    // Attempt to find monetary value (e.g., "R$ 1.200,00" or just "1.200,00" near "Valor")
    // Very naive heuristic
    const valueMatch = text.match(/R\$\s?([\d\.,]+)/)
    if (valueMatch) {
         // Convert 1.200,00 to 1200.00
         const cleanValue = valueMatch[1].replace(/\./g, "").replace(",", ".")
         amount = parseFloat(cleanValue)
    }

    // Attempt to find date (DD/MM/YYYY) associated with "Vencimento"
    // Heuristic: look for date format
    const dateMatch = text.match(/(\d{2})\/(\d{2})\/(\d{4})/)
    if (dateMatch) {
        // Simple parse
        dueDate = new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`)
    }

    return {
        barcode,
        amount,
        dueDate,
        rawText: text
    }
}
