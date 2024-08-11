// -- Day 1: Trebuchet?! ---
import fs from 'node:fs'
import path from 'node:path'

const __dirname = new URL('.', import.meta.url).pathname
function convertFileToArray(filePath) {
  try {
    // Read the file synchronously
    const data = fs.readFileSync(filePath, 'utf8')

    // Split the text by newline characters and filter out empty lines
    const resultArray = data.split('\n').filter((line) => line.trim() !== '')

    return resultArray
  } catch (err) {
    console.error('Error reading file:', err)
    return []
  }
}

// Example usage:
const inputFilePath = path.join(__dirname, 'day1-input.txt')
const calibrationArray = convertFileToArray(inputFilePath)
// Something is wrong with global snow production, and you've been selected to take a look. The Elves have even given you a map; on it, they've used stars to mark the top fifty locations that are likely to be having problems.

// You've been doing this long enough to know that to restore snow operations, you need to check all fifty stars by December 25th.

// Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

// You try to ask why they can't just use a weather machine ("not powerful enough") and where they're even sending you ("the sky") and why your map looks mostly blank ("you sure ask a lot of questions") and hang on did you just say the sky ("of course, where do you think snow comes from") when you realize that the Elves are already loading you into a trebuchet ("please hold still, we need to strap you in").

// As they're making the final adjustments, they discover that their calibration document (your puzzle input) has been amended by a very young Elf who was apparently just excited to show off her art skills. Consequently, the Elves are having trouble reading the values on the document.

// The newly-improved calibration document consists of lines of text; each line originally contained a specific calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.

// For example:

// 1abc2
// pqr3stu8vwx
// a1b2c3d4e5f
// treb7uchet
// In this example, the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.

// Consider your entire calibration document. What is the sum of all of the calibration values?

const arr = ['1abc2', 'pqr3stu8vwx', 'a1b2c3d4e5f', 'treb7uchet']

// 12
// 38
// 15
// 77

// ✅ break string up into array
// test each value at first and last if they're ints
// if int, push into temp array
// if only one int tmp.length < 2, add it twice, copy it
// convert array str to two digit number
// sum all two digit numbers together

/**
 * On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.
 * @param input
 */
function solution(input: string[]) {
  return input
    .map((str) => str.split(''))
    .map((codeArr) => {
      let tmp: string[] = []
      for (let i = 0; i < codeArr.length; i++) {
        if (tmp.length === 2) {
          break
        }
        let first = codeArr[i] ?? 'a'
        let last = codeArr[codeArr.length - 1 - i] ?? 'a'

        if (parseInt(first)) {
          if (first) {
            tmp.unshift(first)
          }
        }
        if (parseInt(last)) {
          tmp.push(last)
        }
      }
      return tmp
    })
    .map((numbStr: string[]) => {
      const num = Number(numbStr.join(''))
      return num
    })
    .reduce((prev, numb) => {
      prev += numb
      return prev
    }, 0)
}

console.log(solution(calibrationArray))
