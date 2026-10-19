
const units = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertBelowThousand(num: number): string {
  let str = "";
  if (num >= 100) {
    str += units[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }
  if (num > 0) {
    if (num < 20) {
      str += units[num] + " ";
    } else {
      str += tens[Math.floor(num / 10)] + " ";
      if (num % 10 > 0) {
        str += units[num % 10] + " ";
      }
    }
  }
  return str.trim();
}

/**
 * Converts an INR number amount into words in the Indian numbering system.
 * e.g. 5000 -> "Five Thousand Rupees Only"
 *      12550 -> "Twelve Thousand Five Hundred Fifty Rupees Only"
 */
export function numberToWordsINR(amount: number): string {
  if (isNaN(amount) || amount <= 0) return "Zero Rupees Only";

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  let num = integerPart;
  let words = "";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const remainder = num;

  if (crore > 0) {
    words += convertBelowThousand(crore) + " Crore ";
  }
  if (lakh > 0) {
    words += convertBelowThousand(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    words += convertBelowThousand(thousand) + " Thousand ";
  }
  if (remainder > 0) {
    words += convertBelowThousand(remainder) + " ";
  }

  words = words.trim();
  if (!words) words = "Zero";

  words += " Rupees";

  if (decimalPart > 0) {
    words += ` and ${convertBelowThousand(decimalPart)} Paise`;
  }

  words += " Only";
  return words;
}
