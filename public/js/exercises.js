/*
  exercises.js - Session 8 Lab, Part 2
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Pure functions only: values in, values out, no DOM. Loaded by index.html
  and login.html, so the results show in the dev tools console (F12).
*/


/* ---------------------------------------------------------------------
   1. EXERCISES
--------------------------------------------------------------------- */

// FizzBuzz - print 1..n. Multiples of 3 become "Fizz",
// multiples of 5 become "Buzz", multiples of both become "FizzBuzz".
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    // Check 15 first: a multiple of both would otherwise stop at "Fizz"
    if (i % 15 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}

// findMax - return the largest value in the array, with a plain loop.
// An empty array has no largest value, so it returns undefined rather
// than a made-up number like 0 (which would be wrong for all-negative data).
function findMax(numbers) {
  if (numbers.length === 0) {
    return undefined;
  }

  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}

// isPalindrome - true if str reads the same backwards, ignoring case,
// spaces and punctuation.
function isPalindrome(str) {
  // Keep only letters and digits, all lowercase: "A man, a plan" -> "amanaplan"
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Compare from both ends towards the middle
  for (let i = 0; i < clean.length / 2; i++) {
    if (clean[i] !== clean[clean.length - 1 - i]) {
      return false;
    }
  }
  return true;
}

// The same isPalindrome as an arrow function: same behaviour, shorter
// syntax. It reverses the cleaned string and compares the two.
const isPalindromeArrow = (str) => {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === clean.split("").reverse().join("");
};


/* ---------------------------------------------------------------------
   2. LOGIN FORM VALIDATION
   The checks login.html will run before sending anything (Sessions
   10-11 wire them to the form; the server still has the final say).
--------------------------------------------------------------------- */

// validateEmail - no spaces, exactly one "@" with text before it, and a
// "." after the "@" with text on both sides.
function validateEmail(email) {
  if (email.includes(" ")) {
    return false;
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return false; // no "@", or more than one
  }

  const [user, domain] = parts;
  if (user.length === 0) {
    return false;
  }

  const dot = domain.lastIndexOf(".");
  // dot > 0: text before the dot; dot < length - 1: text after it
  return dot > 0 && dot < domain.length - 1;
}

// validatePassword - at least 8 characters, with at least one letter
// and at least one digit.
function validatePassword(password) {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  return password.length >= 8 && hasLetter && hasDigit;
}

// validateLoginForm - run both checks and collect a message for each
// one that fails, so the form can show every problem at once.
function validateLoginForm(email, password) {
  const errors = [];

  if (!validateEmail(email)) {
    errors.push("Enter a valid email address, like you@example.com.");
  }
  if (!validatePassword(password)) {
    errors.push("Your password needs at least 8 characters, including a letter and a number.");
  }

  return { valid: errors.length === 0, errors: errors };
}


/* ---------------------------------------------------------------------
   3. TESTS
   console.assert prints nothing when a check passes, so a correct file
   shows only the fizzBuzz(15) output and the JAPS lines below.
--------------------------------------------------------------------- */

// FizzBuzz prints, so verify by eye: fizzBuzz(15) must produce
// 1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz
fizzBuzz(15);

console.assert(findMax([3, 7, 2, 9, 1]) === 9, "findMax basic");
console.assert(findMax([-5, -2, -9]) === -2, "findMax negatives");
console.assert(findMax([]) === undefined, "findMax empty");

console.assert(isPalindrome("racecar") === true, "isPalindrome basic");
console.assert(isPalindrome("A man, a plan, a canal: Panama") === true, "isPalindrome punctuation");
console.assert(isPalindrome("hello") === false, "isPalindrome false case");

// The arrow version must agree with the original
console.assert(isPalindromeArrow("racecar") === true, "isPalindromeArrow basic");
console.assert(isPalindromeArrow("A man, a plan, a canal: Panama") === true, "isPalindromeArrow punctuation");
console.assert(isPalindromeArrow("hello") === false, "isPalindromeArrow false case");

console.assert(validateEmail("fan@riverside.fc") === true, "email valid");
console.assert(validateEmail("fan@riversidefc") === false, "email needs a dot");
console.assert(validateEmail("fanriverside.fc") === false, "email needs an @");

console.assert(validatePassword("Season2026") === true, "password ok");
console.assert(validatePassword("short1") === false, "password too short");
console.assert(validatePassword("allletters") === false, "password needs a digit");

console.assert(validateLoginForm("fan@riverside.fc", "Season2026").valid === true, "form valid");
console.assert(validateLoginForm("nope", "x").errors.length === 2, "form reports both errors");


/* ---------------------------------------------------------------------
   4. REAL JAPS DATA
   Prices in euros, typed in by hand from collections.html, in page order.
--------------------------------------------------------------------- */
const collectionPrices = [
  120, 110, 130, 115, 125, 110, 295,   // tops, dresses and skirts
  290, 265, 245, 240, 260,             // jackets
  135, 145, 120, 140, 165,             // trousers
  125, 125,                            // ballet flats
  195                                  // leather shoulder bag
];

const jacketPrices = [290, 265, 245, 240, 260];

console.log("JAPS - most expensive piece in the collections:", findMax(collectionPrices), "€");
console.log("JAPS - most expensive jacket:", findMax(jacketPrices), "€");
console.log("JAPS - is our name a palindrome?", isPalindrome("JAPS"));
