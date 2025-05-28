const form = document.querySelector("form");
const formButton = 'button[type="submit"]'
const buttonOnSubmit = { selector: formButton, disabled: true }
const buttonOnReceivedFeedback = { selector: formButton, disabled: false }

export { form, formButton, buttonOnSubmit, buttonOnReceivedFeedback }