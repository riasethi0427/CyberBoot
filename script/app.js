// Globals 
let USERNAME,
  USER_SCORE = { correct: 0, incorrect: 0 },
  CORRECT_BEFORE = 0,
  INCORRECT_BEFORE = 0,
  QUIZ_LENGTH = 3,
  CURRENT_QUESTION_INDEX = 0,
  EMAIL_ITEM_LENGTH = 3,
  MAX_PASSWORD_ATTEMPTS = 3,
  PASSWORD_ATTEMPTS = 0,
  PASSWORDS = [],
  PROGRESS = 0,
  MIN_SCORE_PERCENTAGE = 80,
  SCORE_STAGING = {
    phishing: {
      correct: 0,
      incorrect: 0,
    },
    phishingQuiz: {
      correct: 0,
      incorrect: 0,
    },
    passwordSecurity: {
      correct: 0,
      incorrect: 0,
    },
    passwordSecurityQuiz: {
      correct: 0,
      incorrect: 0,
    },
    onlineSafety: {
      correct: 0,
      incorrect: 0,
    },
    onlineSafetyQuiz: {
      correct: 0,
      incorrect: 0,
    },
  };

// Function to update the score displayed on the page
function updateScore(correct, incorrect) {
  // Select all elements with class 'correct' and 'incorrect'
  const correctElements = document.querySelectorAll(".correct");
  const incorrectElements = document.querySelectorAll(".incorrect");

// Update the text content of elements with class 'correct'
  correctElements.forEach((element) => {
    element.textContent = `Correct: ${correct}`;
  });

  // Update the text content of elements with class 'incorrect'
  incorrectElements.forEach((element) => {
    element.textContent = `Incorrect: ${incorrect}`;
  });
}

// Updates the circular progress indicator's visual representation based on percentage of completion
function updateProgress(percentage) { 
  const radius = 100; // Define the radius of the circle
  const circumference = 2 * Math.PI * radius;  // Calculate the circumference of the circle using the formula C = 2πr
  // Calculate the stroke dash offset which determines how much of the circle should be filled
  const offset = circumference - (percentage / 100) * circumference;
  // Select the SVG circle element with class 'fg' inside a parent with the class 'circular-progress'
  const circle = document.querySelector(".circular-progress .fg");
  circle.style.strokeDashoffset = offset;
}
/*
Resource Used (Progress Bar): 
https://stackoverflow.com/questions/67562296/updating-percentage-in-progress-circle 
This function updates the progress of a circular progress bar based on the provided 
percentage value. It calculates the stroke dash offset to represent the progress visually, 
adjusting the position of the stroke to fill the circular path accordingly. It applies this offset 
to the circular progress bar element, reflecting the progress represented by the percentage 
value on the page. This resource helped me use functions and logic, such as Math.PI, and
the logic of initializing a radius variable, to form my code in order to appropriately advance 
the progress bar.
*/

// Function to update username
function updateUsername(username = "John Doe") {
  // Update the global variable USERNAME with the provided username
  USERNAME = username;
  // Update the username displayed in the navbar and other elements
  document.querySelector(".username").textContent = USERNAME;
  document.querySelector(".person").textContent = USERNAME;
}

// Data related with Mails that appear on the Phishing activity page 
let allMailItems = [
  {
    id: 1,
    subject: "Urgent: Unauthorized Login Attempt Detected!",
    sender: "PayPal",
    senderEmail: "support@paypal.com",
    time: "5:00 PM",
    mailText:
      "We've detected an unauthorized attempt to log in to your account. Click the link below to verify your account immediately or your account will be permanently locked.",
    url: "https://www.paypal.com/login",
    isPhishing: true,
    explanation: `Even though the sender's email address appears correct, the urgent tone and threat of account locking are typical of phishing attempts to provoke immediate action.`,
  },
  {
    id: 2,
    subject: "Welcome to Spotify!",
    sender: "Spotify",
    senderEmail: "no-reply@spotify.com",
    time: "6:00 PM",
    mailText:
      "Thanks for joining Spotify. Here's how to get started with your new account. No action required.",
    url: "https://www.spotify.com/",
    isPhishing: false,
    explanation:
      "The sender's domain matches the official Spotify domain, and the email content does not request any action from the recipient, aligning with typical welcome emails from legitimate services.",
  },
  {
    id: 3,
    subject: "Your Order Has Shipped",
    sender: "Amazon",
    senderEmail: "orders@amazon.com",
    time: "9:30 AM",
    mailText:
      "Your order #123456789 has shipped. You can track your package's progress or view your order's details on our website.",
    url: "https://www.amazon.com/",
    isPhishing: false,
    explanation:
      "It comes from an official Amazon domain with specific information about an order, including the ability to track the package, which is a common practice for legitimate order confirmation emails.",
  },
  {
    id: 4,
    subject: "Confirm Your Email Address",
    sender: "Verify Email",
    senderEmail: "confirmation@verify-email.com",
    time: "11:45 AM",
    mailText:
      "We've noticed some irregularities in your account. To continue using our services without interruption, please confirm your email address by clicking here.",
    url: "https://www.verify-email.com/",
    isPhishing: true,
    explanation:
      'The email uses vague language about "irregularities" to trick the recipient into clicking a link, a strategy often employed in phishing to gather personal information.',
  },
  {
    id: 5,
    subject: "Failed Delivery Attempt",
    sender: "Fedex Notifications",
    senderEmail: "fedex-notifications@fedex.com",
    time: "1:15 PM",
    mailText:
      "We were unable to deliver your package today due to a payment issue. Click here to update your payment details and arrange a new delivery date.",
    url: "https://www.fedex.com",
    isPhishing: true,
    explanation:
      "The request to click a link due to a payment issue from an email address (fedex-notifications@fedex.com) that looks legitimate but may be faked indicates a phishing scam.",
  },
  {
    id: 6,
    subject: "Software Update Available",
    sender: "Microsoft",
    senderEmail: "updates@microsoft.com",
    time: "3:00 PM",
    mailText:
      "A new update for your software is available. To install the latest version, please open your application and navigate to the 'Update' section under settings.",
    url: "https://www.microsoft.com/en-us/software-download/windows10",
    isPhishing: false,
    explanation:
      "Sent from Microsoft's official domain, it advises users to update through their application directly, which is a secure practice avoiding direct links.",
  },
  {
    id: 7,
    subject: "Feedback Request",
    sender: "Best Buy Support",
    senderEmail: "feedback@bestbuy.com",
    time: "4:30 PM",
    mailText:
      "Thank you for your recent purchase. We'd love to hear your thoughts on your new product. Click here to take a short survey.",
    url: "https://www.bestbuy.com/feedback",
    isPhishing: false,
    explanation:
      "Coming from Best Buy's official domain, this email invites feedback through a survey, a common and genuine request from businesses to improve their services.",
  },
  {
    id: 8,
    subject: "Payment Issue Detected!",
    sender: "Billing Department",
    senderEmail: "billing@online-payments.com",
    time: "7:00 PM",
    mailText:
      "There was a problem processing your latest payment. Please update your payment details through the following link to avoid service disruption.",
    url: "https://www.online-payments.com/billing-update",
    isPhishing: true,
    explanation:
      "Phishing emails often fabricate payment issues to trick individuals into entering their payment information on a malicious site. Legitimate companies usually provide more context and do not solicit sensitive information directly via email links.",
  },
  {
    id: 9,
    subject: "Data Privacy Update",
    sender: "Data Protection Team",
    senderEmail: "privacy@data.com",
    time: "8:30 PM",
    mailText:
      "We've updated our privacy policy. To review what's changed and how we protect your data, visit our website. No login required.",
    url: "https://www.data.com/privacy-policy-update",
    isPhishing: false,
    explanation:
      "This email informs recipients of policy updates and invites them to review changes without pressing for personal information, reflecting legitimate business practices.",
  },
  {
    id: 10,
    subject: "Update Your Password Immediately",
    sender: "Microsoft Security Team",
    senderEmail: "security@microsoft.com",
    time: "9:45 PM",
    mailText:
      "We've detected unusual activity on your account. For your security, click here to update your password immediately and enter your payment information before we ban all your accounts.",
    url: "https://account.microsoft.com/security",
    isPhishing: true,
    explanation:
      "This indicates a phishing attempt to prompt immediate, unthinking action. It asks for information unrelated to passwords, such as payment information.",
  },
  {
    id: 11,
    subject: "Urgent Help Needed",
    sender: "Family Support Team",
    senderEmail: "familysupport@help.com",
    time: "9:45 PM",
    mailText:
      "Hi Sweetie, I'm in a bit of a rush and need your help urgently. I've lost my wallet and phone and need to pay for groceries right now. That's why I'm emailing you here. Can you please send me your online banking login details or transfer $500 to this account I've just set up? I promise to sort it out as soon as I find my wallet.",
    url: "https://family-support.com",
    isPhishing: true,
    explanation:
      "This email pretends to be from your mom in a crisis to trick you into sending money or banking details from a separate email address. Phishing can often involve impersonation, creating a sense of urgency to make you act quickly without thinking.",
  },
];
/*
  Resources Used (phishing email examples):
  https://blog.usecure.io/the-most-common-examples-of-a-phishing-email
  https://cofense.com/knowledge-center-hub/real-phishing-email-examples/ 
  These websites helped me identify various tactics employed in phishing emails, which was crucial for developing 
  content and scenarios for phishing awareness training tools within my project. By understanding these common 
  tactics, I was able to simulate phishing attempts more accurately, providing users with knowledge 
  and tools to recognize and avoid real-life phishing attacks. This resource helped me with the educational 
  aspect of the security training modules as well as creating a more secure email communication environment.
  for users.
 */

// Data related with Modals  (Configuration object storing different modal settings for the application)
const modals = {
  trainingModal: {
    id: "trainingModal",
    title: "Purpose",
    message:
      "In this training, you will learn how to stay safe online. This includes understanding phishing, making wise password choices, and communicating securely online.",
    image: "images/training-instructions.svg",
    alt: "Cyber Security",
    nextModal: "attemptQuizModal",
    skipButton: "Skip",
    nextButton: "Next",
    nextFunction: null,
  },
  attemptQuizModal: {
    id: "attemptQuizModal",
    title: "Goal",
    message:
      "You learn about common cybersecurity issues through <br> 1. Reading information about the issue.<br> 2. Completing online activities.<br> 3. Completing quizzes.",
    image: "images/attempt-quiz.svg",
    alt: "Attempt Quiz",
    nextModal: "trackingProgressModal",
    skipButton: "Skip",
    nextButton: "Next",
    nextFunction: null,
  },
  trackingProgressModal: {
    id: "trackingProgressModal",
    title: "Tracking Progress",
    message:
      "You can track your progress via the progress bar on the upper right side of the screen.",
    image: "images/tracking-progress.svg",
    alt: "Track Progress",
    nextModal: "earnYourCertificateModal",
    skipButton: "Skip",
    nextButton: "Next",
    nextFunction: null,
  },
  earnYourCertificateModal: {
    id: "earnYourCertificateModal",
    title: "To Earn Your Certificate",
    message:
      "Once you correctly complete at least 80% of the activities, you will have the opportunity to receive a certificate of completion",
    image: "images/earn-your-certificate.svg",
    alt: "Earn Certificate",
    nextModal: null,
    skipButton: "Get Started",
    nextButton: null,
    nextFunction: null,
  },
  goBackLoginModal: {
    id: "goBackLoginModal",
    title: "Go Back To Login Screen",
    message:
      "Do you really want to go back? You don't want to continue with your task ahead?",
    image: "images/go-back.svg",
    alt: "Go Back",
    nextModal: null,
    skipButton: "Continue",
    nextButton: "Go Back",
    nextFunction: function () {
      // Reload the index.html page
      location.reload();
    },
  },
  startPhishingActivityModal: {
    id: "startPhishingActivityModal",
    title: "Initiating the Phishing Activity",
    message:
      "By participating in this activity, you can significantly improve your knowledge and understanding, thereby enhancing your ability to recognize and combat phishing attempts effectively.",
    image: "images/start-activity.svg",
    alt: "Start Phishing Activity",
    nextModal: null,
    skipButton: "Back",
    nextButton: "Start Activity",
    nextFunction: function () {
      // Start the phishing activity
      console.log("Phishing activity started");
      // Add d-none on phishingActivityIntro
      document.getElementById("phishingActivityIntro").classList.add("d-none");
      // Create mail items
      createMailItemsHTML(allMailItems);
      // Remove d-none from emailSection
      document.getElementById("emailSection").classList.remove("d-none");
    },
  },
  startPhishingQuizModal: {
    id: "startPhishingQuizModal",
    title: "Congratulations!",
    message:
      "You have successfully completed the phishing activity. Now, your quiz is ready for the next step. Let's proceed!",
    image: "images/activity-complete.svg",
    alt: "Start Phishing Quiz",
    nextModal: null,
    skipButton: "Restart Activity",
    nextButton: "Start Quiz",
    nextFunction: function () {
      // Start the phishing quiz
      console.log("Phishing quiz started");
      // Add score
      CORRECT_BEFORE = USER_SCORE.correct;
      INCORRECT_BEFORE = USER_SCORE.incorrect;
      // Update the activity score
      SCORE_STAGING.phishing.correct = USER_SCORE.correct;
      SCORE_STAGING.phishing.incorrect = USER_SCORE.incorrect;
      // Update progress
      PROGRESS += 16.7;
      updateProgress(PROGRESS);
      startQuiz("phishing", "completePhishingTask"); // Start the phishing quiz
    },
    skipFunction: function () {
      console.log("Restarting the phishing activity - Skip Function");
      // Restore the previous score
      // Remove the mail items
      document.querySelector(".mail-listing").innerHTML = "";
      // Create mail items
      createMailItemsHTML(allMailItems);
      // Correct the score
      USER_SCORE.correct = 0;
      USER_SCORE.incorrect = 0;
      updateScore(0, 0);
    },
  },
  completePhishingTask: {
    id: "completePhishingTask",
    title: "Congratulations!",
    message: "On completing your first task! Your second task awaits you.",
    image: "images/task-complete.svg",
    alt: "Complete Phishing Task",
    nextModal: null,
    skipButton: "Restart Quiz",
    nextButton: "Continue",
    nextFunction: function () {
      // Start the password security activity
      CORRECT_BEFORE = USER_SCORE.correct;
      INCORRECT_BEFORE = USER_SCORE.incorrect;
      // Update the quiz score
      SCORE_STAGING.phishingQuiz.correct = USER_SCORE.correct;
      SCORE_STAGING.phishingQuiz.incorrect = USER_SCORE.incorrect;
      // Update progress
      PROGRESS += 16.7;
      updateProgress(PROGRESS);
      // Remove the question bg from the body
      document.body.classList.remove("question-image");
      // Remove d-none from passwordSecurityActivityIntro
      document
        .getElementById("passwordSecurityActivityIntro")
        .classList.remove("d-none");
    },
    skipFunction: function () {
      console.log("Restarting the phishing Quiz - Skip Function");
      // Restore the previous score
      USER_SCORE.correct = CORRECT_BEFORE;
      USER_SCORE.incorrect = INCORRECT_BEFORE;
      updateScore(USER_SCORE.correct, USER_SCORE.incorrect);
      startQuiz("phishing", "completePhishingTask"); // Start the phishing quiz
    },
  },
  startPasswordSecurityActivityModal: {
    id: "startPasswordSecurityActivityModal",
    title: "Initiating the Password Security Activity",
    message:
      "By engaging in this activity, you can significantly enhance your understanding of password security, thereby strengthening your ability to recognize and thwart phishing attempts effectively.",
    image: "images/start-activity.svg",
    alt: "Start Password Security Activity",
    nextModal: null,
    skipButton: "Back",
    nextButton: "Start Activity",
    nextFunction: function () {
      // Start the password security activity
      console.log("Password security activity started");
      // Add d-none on passwordSecurityActivityIntro
      document
        .getElementById("passwordSecurityActivityIntro")
        .classList.add("d-none");
      // Remove d-none passwordActivityScreen
      document
        .getElementById("passwordActivityScreen")
        .classList.remove("d-none");
    },
  },
  startPasswordSecurityQuizModal: {
    id: "startPasswordSecurityQuizModal",
    title: "Congratulations!",
    message:
      "You have successfully completed the Password Security activity. Now, your quiz is ready for the next step. Let's proceed!",
    image: "images/activity-complete.svg",
    alt: "Start Password Security Quiz",
    nextModal: null,
    skipButton: "Restart Activity",
    skipFunction: function () {
     // Function executed when the 'Restart Activity' button is clicked.
      PASSWORD_ATTEMPTS = 0; // resets password attempt counter to 0
     // Restores the scores to their values before the last activity began.
      USER_SCORE.correct = CORRECT_BEFORE;
      USER_SCORE.incorrect = INCORRECT_BEFORE;
      updateScore(USER_SCORE.correct, USER_SCORE.incorrect); // Updates the displayed scores to these restored values.
    },
    nextButton: "Start Quiz",
    nextFunction: function () {
      PASSWORD_ATTEMPTS = 0;
      // Start the password security quiz
      console.log("Password security quiz started");
      // Add d-none on passwordActivityScreen
      document.getElementById("passwordActivityScreen").classList.add("d-none");
      // Add question-image class to the body
      document.body.classList.add("question-image");
      // Update activity score
      SCORE_STAGING.passwordSecurity.correct = USER_SCORE.correct;
      SCORE_STAGING.passwordSecurity.incorrect = USER_SCORE.incorrect;
      // Add score
      CORRECT_BEFORE = USER_SCORE.correct;
      INCORRECT_BEFORE = USER_SCORE.incorrect;
      // Update progress
      PROGRESS += 16.7;
      updateProgress(PROGRESS); // Updates progress bar
      startQuiz("passwordSecurity", "completePasswordSecurityTask"); // Start the password security quiz
    },
  },
  completePasswordSecurityTask: {
    id: "completePasswordSecurityTask",
    title: "Congratulations!",
    message: "On completing your Second task! Your Third task awaits you.",
    image: "images/task-complete.svg",
    alt: "Complete Password Security Task",
    nextModal: null, // Indicates there is no automatic next modal transition.
    skipButton: "Retry Quiz", // Provides an option to retry the quiz.
    skipFunction: function () {
      PASSWORD_ATTEMPTS = 0; // Reset the password attempt counter.
      USER_SCORE.correct = CORRECT_BEFORE;
      USER_SCORE.incorrect = INCORRECT_BEFORE;
      updateScore(USER_SCORE.correct, USER_SCORE.incorrect);  // Update the score display to reflect these restored scores.
      startQuiz("passwordSecurity", "completePasswordSecurityTask"); // Start the password security quiz
    },
    nextButton: "Continue", // Provides an option to proceed to the next task.
    nextFunction: function () {
      // Add quiz score
      SCORE_STAGING.passwordSecurityQuiz.correct = USER_SCORE.correct;
      SCORE_STAGING.passwordSecurityQuiz.incorrect = USER_SCORE.incorrect;
      // Update progress
      CORRECT_BEFORE = USER_SCORE.correct;
      INCORRECT_BEFORE = USER_SCORE.incorrect;
      // Update progress bar
      PROGRESS += 16.7;
      updateProgress(PROGRESS);
      // remove the question bg from the body
      document.body.classList.remove("question-image");
      // Make the password security activity intro visible again for the user to possibly revisit or proceed from.
      document
        .getElementById("onlineSafetyActivityIntro")
        .classList.remove("d-none");
    },
  },
  startOnlineSafetyActivityModal: {
    id: "startOnlineSafetyActivityModal",
    title: "Initiating the Online Bullying Activity",
    message:
      "By engaging in this activity, you can significantly enhance your understanding of online bullying, thereby strengthening your ability to recognize and address harmful behaviors effectively.",
    image: "images/start-activity.svg",
    alt: "Start Password Security Activity",
    nextModal: null, // No next modal to automatically trigger after this
    skipButton: "Back",
    nextButton: "Start Activity", 
    nextFunction: function () {
      // Start the online safety activity
      console.log("Online safety activity started");
      // Add d-none on passwordSecurityActivityIntro
      document
        .getElementById("onlineSafetyActivityIntro")
        .classList.add("d-none");
      // Remove d-none from chatActivityScreen
      document.getElementById("chatActivityScreen").classList.remove("d-none");
      // Shuffle the chat questions
      shuffleArray(CHAT_QUESTIONS);
      displayChatQuestion();
    },
  },
  startOnlineSafetyQuizModal: {
    // Modal displayed after completing the online safety activity and before starting the quiz
    id: "startOnlineSafetyQuizModal",
    title: "Congratulations!",
    message:
      "You have successfully completed the Online Safety activity. Now, your quiz is ready for the next step. Let's proceed!",
    image: "images/activity-complete.svg",
    alt: "Start Online Safety Quiz",
    nextModal: null, // No next modal to automatically trigger after this
    skipButton: "Restart Activity", // Button text for restarting the activity
    skipFunction: function () {
      // update score
      USER_SCORE.correct = CORRECT_BEFORE; // Reset correct score to its initial state
      USER_SCORE.incorrect = INCORRECT_BEFORE; // Reset incorrect score to its initial state
      updateScore(USER_SCORE.correct, USER_SCORE.incorrect); // Update the display of the scores
      shuffleArray(CHAT_QUESTIONS); // Shuffle the quiz questions for randomness
      displayChatQuestion(); // Display the first question from the shuffled array
    },
    nextButton: "Start Quiz", // Button to proceed to the quiz
    nextFunction: function () { // Function to initialize quiz settings
      SCORE_STAGING.onlineSafety.correct = USER_SCORE.correct; // Stage the current correct score
      SCORE_STAGING.onlineSafety.incorrect = USER_SCORE.incorrect; // Stage the current incorrect score
      console.log("Online Safety quiz started");
      document.getElementById("chatActivityScreen").classList.add("d-none"); // Hide the chat activity screen
      document.body.classList.add("question-image"); // Add background class for quiz questions
      CORRECT_BEFORE = USER_SCORE.correct; // Backup the current correct score
      INCORRECT_BEFORE = USER_SCORE.incorrect;// Backup the current incorrect score
      PROGRESS += 16.7; // Updates progress
      updateProgress(PROGRESS);
      startQuiz("onlineSafety", "completeOnlineSafetyTask"); // Start the online safety quiz
    },
  },
   // Modal displayed upon completing the online safety quiz
  completeOnlineSafetyTask: {
    id: "completeOnlineSafetyTask",
    title: "Congratulations!",
    message: "Congratulations on completing your tasks!",
    image: "images/task-complete.svg",
    alt: "Complete Online Safety Task",
    nextModal: null,
    skipButton: "Restart Quiz",
    skipFunction: function () { // Function to restart the quiz from the beginning
      USER_SCORE.correct = CORRECT_BEFORE; // Restore the scores from backup
      USER_SCORE.incorrect = INCORRECT_BEFORE;
      updateScore(USER_SCORE.correct, USER_SCORE.incorrect); // Update the score display
      startQuiz("onlineSafety", "completeOnlineSafetyTask"); // Start the online safety quiz
    },
    nextButton: "Check Eligibility", // Button to check eligibility for certificate
    nextFunction: function () { // Function to determine if user is eligible for a certificate
      console.log("Certificate Eligibility Criteria"); // Log checking criteria
      SCORE_STAGING.onlineSafetyQuiz.correct = USER_SCORE.correct; // Stage the quiz scores
      SCORE_STAGING.onlineSafetyQuiz.incorrect = USER_SCORE.incorrect;
      PROGRESS += 16.7;  // Increment progress
      updateProgress(PROGRESS); // Update progress display
      let userPercentage = Math.ceil( // Calculate the user's score percentage
        (USER_SCORE.correct / (USER_SCORE.correct + USER_SCORE.incorrect)) * 100
      );
      if (userPercentage < MIN_SCORE_PERCENTAGE) {
        console.log("You have failed: ", userPercentage); // Log failure
        // show the certificate eligibility modal
        let failureDueToLessScore = new bootstrap.Modal( // Show the failure modal
          document.getElementById("failureDueToLessScore")
        );
        failureDueToLessScore.show();
      } else {
        // display certificate
        console.log("User Passed the threshold, Certificate: ", userPercentage); // Log passing the threshold
        document
          .getElementById("certificateContent")
          .classList.remove("d-none");
        document.getElementById("save-pdf").classList.remove("d-none");
        // remove the question bg from the body
        document.body.classList.remove("question-image"); // Remove the quiz background class
      }
    },
  },
  // Configuration for the 'goBack' modal, providing users with the option to return to previous tasks or continue.
  goBack: {
    id: "goBack",
    message:
      "Do you really want to go back? You don't want to continue with your task ahead?",
    image: "images/go-back.svg",
    alt: "Go Back", // Alternate text for image, improving accessibility
    nextModal: null,// No next modal automatically triggered
    skipButton: "Go Back",// Text on the button for going back
    nextButton: "Continue",// Text on the button to continue with the task
    nextFunction: null,// No function linked, implies continuation of current process without specific action
  },
  // Configuration for the 'certificateEligibilityCriteria' modal, informing users of the score needed for certification.
  certificateEligibilityCriteria: {
    id: "certificateEligibilityCriteria",
    title: "Certificate Eligibility Criteria",
    message:
      "Once you achieve a score of 80%, you will be eligible to receive the certificate. Keep up the good work!",
    image: "images/certificate-warning.svg",
    alt: "Certificate Eligibility Criteria",
    nextModal: null,
    skipButton: "Restart App", // Button to restart the application
    skipFunction: function () { // Function to reload the page, effectively restarting the application
      location.reload();
    },
    nextButton: "Continue", // Button to proceed without action, typically closing the modal
    nextFunction: function () {}, // Empty function; could be implemented for additional behavior on continue
  },
  // Configuration for the 'failureDueToLessScore' modal, displayed if a user does not meet the score threshold for a certificate.
  failureDueToLessScore: {
    id: "failureDueToLessScore",
    title: "Sorry",
    message:
      "You have not achieved the required score to receive the certificate. Please try again.",
    image: "images/certificate-warning.svg",
    alt: "Certificate Eligibility Criteria",
    nextModal: null,
    skipButton: "Restart App", // Provides a way to quickly restart the application
    skipFunction: function () { // Function to restart the entire application by reloading the page
      location.reload();
    },
  },
};

const createModalHTML = (modal) => {
  return `
        <!-- Modal: ${modal.id} via App.js -->
        <div class="modal fade" id="${
          modal.id
        }" tabindex="-1" aria-labelledby="${
    modal.id
  }Label" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="popup-screen d-flex align-items-center p-md-5 bg-white">
                            <div class="row g-0 w-100">
                                <div class="col-lg-6 d-flex flex-column justify-content-center">
                                    <div class="d-flex flex-column justify-content-between h-100">
                                        <div>
                                            <!-- Title of the modal -->
                                            <h1 class="text-capitalize">${
                                              modal.title
                                            }</h1>
                                            <!-- Message within the modal -->                                           
                                            <p class="mt-4">${modal.message}</p>
                                        </div>
                                        <div class="d-flex justify-content-between w-100">
                                        <!-- Skip button: conditionally rendered based on modal.skipButton -->
                                            <a href="#" class="btn ${
                                              modal.nextButton
                                                ? "btn-outline-primary"
                                                : "btn-primary"
                                            }" data-bs-dismiss="modal" ${
    modal.skipFunction
      ? `onclick="modals.${modal.id + "." + modal.skipFunction.name}()"`
      : ""

  }>${modal.skipButton}</a>
                                        <!-- Next button: conditionally rendered based on modal.nextButton -->
                                        ${
                                          modal.nextButton
                                            ? `<a href="#" class="btn btn-primary" data-bs-dismiss="modal" ${
                                                modal.nextModal
                                                  ? `data-bs-target="#${modal.nextModal}" data-bs-toggle="modal"`
                                                  : ""
                                              } ${
                                                modal.nextFunction
                                                  ? `onclick="modals.${
                                                      modal.id +
                                                      "." +
                                                      modal.nextFunction.name
                                                    }()"`
                                                  : ""
                                              }>${modal.nextButton}</a>`
                                            : ""
                                        } 
                                        </div>
                                    </div>
                                </div>
                                <!-- Image on the right half of the modal -->
                                <div class="col-lg-6 p-5">
                                    <img src="${
                                      modal.image
                                    }" class="img-fluid" alt="${modal.alt}" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

/*
Resources used (Modals):
https://codeshack.io/interactive-modals-javascript/#:~:text=Modals%20appear%20above%20the%20content,return%20to%20the%20page%20content
https://www.w3schools.com/bootstrap/bootstrap_ref_js_modal.asp 
By leveraging the createModalHTML function alongside insights from resources like 
CodeShack and W3Schools, I significantly enhanced my ability to dynamically create 
and manage modals. This approach simplifies the development process, allowing 
for rapid customization and implementation of interactive dialog boxes tailored to 
user needs. It streamlines my code, making it more maintainable and enriching the 
user experience by ensuring modals are both attention-grabbing and functionally 
relevant. I gained a powerful tool for crafting engaging web interfaces with improved 
usability and aesthetic appeal.
*/

// for Validating the login form
function validateUserName() {
  let name = document.getElementById("name").value;
  let alert = document.getElementById("alert");
  // log the name
  console.table(name, alert);

  // Check if the name is empty
  if (name.trim() === "") {
    alert.style.display = "block";
    alert.textContent = "Please enter your name";
    return false;
  }

  // Check if the name contains only letters and spaces and is at least 3 characters long
  if (!/^[a-zA-Z ]{3,}$/.test(name)) {
    alert.style.display = "block";
    alert.textContent =
      "Please enter a valid name. It should be at least 3 characters long.";
    return false;
  }
  // If the name is valid, hide the alert and proceed with the form submission
  alert.style.display = "none";
  // remove the login screen
  document.getElementById("loginScreen").remove();
  // remove the d-none class from the  phishing activity
  document.getElementById("phishingActivityIntro").classList.remove("d-none");
  // Show the modal after the form is submitted
  let trainingModal = new bootstrap.Modal(
    document.getElementById("trainingModal")
  );
  trainingModal.show();
  // remove the d-none class from the navbar
  document.getElementById("navbar").classList.remove("d-none");
  // update the username
  updateUsername(name);
  // update the score
  USER_SCORE.correct = 0;
  USER_SCORE.incorrect = 0;
  updateScore(0, 0);
  return true;
}
/* Resources used (name finding): 
https://forum.freecodecamp.org/t/how-do-i-insert-an-email-address-to-an-array/571435/6 
https://stackoverflow.com/questions/12833110/get-the-input-box-name-using-javascript 
These programs facilitated ideas for me on how to error check for name inputs, log 
the name and alert element, check for empty input, and validate the name pattern 
so that special characters can’t be used. This function primarily focuses on client-side validation to improve the user 
experience by providing immediate feedback on the validity of the username input, 
without needing to submit the form and wait for server-side validation.
 */
// Start the phishing activity
// Define your activities dictionary
let activitiesIntro = {
  phishingActivity: {
    id: "phishingActivityIntro",
    title: "What is Phishing?",
    heading: "Common Tactics Of Phishing",
    subHeading: "How To Recognize Phishing Attempts",
    description: [
      "A technique used to trick individuals into revealing sensitive information, like bank account numbers, by posing as a trustworthy entity or person in fraudulent emails or websites.",
    ],
    tactics: [
      "Email Spoofing: Altering email metadata due to lack of authentication in email protocols.",
      "Deceptive Links: Google Safe Browsing flags potentially malicious content, protecting users from deceptive links.",
      "Fake Login Pages: Phishing pages trick users into divulging login credentials for email, social media, or banking services.",
      "Urgency or Threats: Phishing induces fear or urgency, pressuring victims to disclose sensitive information or click malicious links.",
      "Impersonation: Attackers impersonate others to deceive victims into divulging confidential data or transferring money.",
      "Malicious Attachments: Deceptive attachments install malware upon opening, capable of data theft and destruction.",
      "Social Engineering: Manipulating individuals to assist attackers' objectives through various tactics.",
    ],
    recognition: [
      "Recognizing phishing means watching for signs like odd sender addresses, urgent requests, weird links, personal info requests, bad grammar, and unexpected files, and always verifying with the sender before doing anything.",
    ],
    nextModal: "startPhishingActivityModal",
  },
/* 
Resource used (Phishing info): 
https://www.checkpoint.com/cyber-hub/threat-prevention/what-is-phishing/ 
I used this website to write information about phishing before the user continues with 
their activities. This helped me understand common phishing threats and also 
communicate about phishing in a way that is understandable to the user before 
proceeding with the activities and quizzes.
*/
  passwordSecurityActivity: {
    id: "passwordSecurityActivityIntro",
    title: "What is Password Security?",
    heading: "Common Tactics Of Password Security",
    subHeading: "How To Recognize Online Safety",
    description: [
      "Password security involves protecting passwords from unauthorized access or theft. It includes using strong, unique passwords, storing them securely, and safeguarding against unauthorized access or breaches.",
    ],
    tactics: [
      "Unique Passwords: Use strong, unique passwords for each account.",
      "Guessable Info: Avoid using easily guessable information, like birthdays or pet names.",
      "Multi-Factor Authentication: Enable multi-factor authentication whenever possible.",
      "Password Updates: Regularly update passwords, especially after security breaches.",
      "Password Updates: Use a reputable password manager to securely store passwords.",
      "Phishing: Beware of phishing attempts to steal login credentials.",
      "Secure Sharing: Never share passwords via email or other insecure channels.",
      "Data Encryption: Use encryption for sensitive data transmission.",
    ],
    recognition: [
      "Recognizing password security involves creating complex, unique, and regularly updated passwords, along with utilizing two-factor authentication for enhanced security.",
    ],
    nextModal: "startPasswordSecurityActivityModal",
  },
/* 
Resource used (Password info):
https://www.popsci.com/how-to-choose-safe-passwords/ 
I used this website to write information about choosing safe passwords before the user 
continues with their password activity. This helped me shape the restrictions for my activity, such 
as common phrases not to use, including an uppercase letter, a character, and a minimum 
number of characters. It also helped me communicate how to choose passwords in a way that is 
understandable to the user before proceeding with the activities and quizzes.
*/
  onlineSafetyActivity: {
    id: "onlineSafetyActivityIntro",
    title: "What Type of Information Can I Safely Share Online?",
    heading: "What Type of Information Should I Never Disclose Online?",
    subHeading: "How Do I Recognize Requests for Unsafe Information?",
    description: [
      "Public Profile Details: Information like your name (if comfortable) and your interests that you don't mind being public.",
      "Professional Information: Details related to your job or career that you'd share on professional networking sites, such as LinkedIn.",
      "General Opinions: Sharing your thoughts on non-controversial topics, like your favorite books or movies, is usually safe.",
      "Content Creation: Posting your art, writing, or other personal projects that don't reveal sensitive personal information",
    ],
    tactics: [
      "Personal Identification Numbers: Social Security numbers, driver's license numbers, and other government identification should always be kept private.",
      "Financial Information: Bank account details, credit card numbers, and financial statements should never be shared.",
      "Passwords and Login Credentials: Sharing passwords, even with trusted friends or family, can lead to unauthorized access to your accounts",
      "Home Address and Phone Number: Revealing where you live or your personal phone number can make you a target for scams or worse.",
      "Sensitive Personal Information: Information about your daily routines, upcoming vacations, or family members can be used maliciously.",
      "Urgent Financial Requests: Any request for money transfers, even if it appears to come from a friend or a known entity, should be verified through other means.",
      "Attachments or Links from Unknown Sources: Similar to phishing, be wary of opening or clicking anything that comes from an unfamiliar source.",
      "Private Photos or Information: Sharing private photos or information that you wouldn't want publicly accessible should be avoided.",
    ],
    recognition: [
      "Unsolicited Requests: Any request for personal or sensitive information that you weren't expecting should be a red flag.",
      "Pressure or Threats: Urgent requests or threats related to sharing information should be treated with caution.",
      "Vague or Generic Messaging: Messages that don't address you directly or seem generic can indicate a phishing attempt or a scam.",
      "Poor Grammar or Spelling: Official communications usually don't have major errors, so mistakes can be a sign of a scam.",
      "Mismatched or Suspicious URLs: Hover over any links to see if the URL matches the expected destination. Look for subtle misspellings or incorrect domains.",
    ],
    nextModal: "startOnlineSafetyActivityModal",
  },
};
/* 
Resource used (Online Saftey info):
https://www.washington.edu/doit/online-safety-tips-protecting-your-personal-information#:~:text=No%20one%20needs%20to%20know,be%20used%20by%20online%20predators. 
I used this website to facilitate my research on how to tell users how to communicate online 
before proceeding with the actual activity. This one was more time-consuming as sometimes it is 
hard to decipher what to share and what not to share online. This website greatly helped me 
with telling people what they can and cannot share online and it also helped facilitate the 
questions I wanted to ask in my activity.
*/

// Define createActivityIntroHTML function
const createActivityIntroHTML = (activity) => {
 // Return a string containing HTML for the activity details section
  return `
    <!-- Start of ${activity.title} Activity Details -->
    <div id="${
      activity.id
    }" class="d-none shadow-sm m-md-5 p-3 bg-white rounded">
      <div class="activity-intro-header row g-0">
        <div class="col-12 d-flex justify-content-end">
          <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#goBackLoginModal">Back</a>
        </div>
      </div>

      <div class="activity-intro-row row g-0">
        <div class="col-12 p-3">
          <h2 class="text-primary text-capitalize">${activity.title}</h2>
          <ul>
            ${activity.description
              .map((description) => {
                if (description.includes(":")) {
                  const [title, ...content] = description.split(": ");
                  return `<li><span class="fw-bold">${title}:</span> ${content.join(
                    ": "
                  )}</li>`;
                } else {
                  return `<li><span class="fw-bold">${description}</span></li>`;
                }
              })
              .join("")}
          </ul>
        </div>
      </div>

      <div class="activity-intro-row row g-0">
        <div class="col-12 p-3">
          <h2 class="text-primary text-capitalize"> ${activity.heading}</h2>
           <ul>
            ${activity.tactics
              .map((tactic) => {
                if (tactic.includes(":")) {
                  const [title, ...description] = tactic.split(": ");
                  return `<li><span class="fw-bold">${title}:</span> ${description.join(
                    ": "
                  )}</li>`;
                } else {
                  return `<li><span class="fw-bold">${tactic}</span></li>`;
                }
              })
              .join("")}
          </ul>
        </div>
      </div>

      <div class="activity-intro-row row g-0">
      <!-- Footer with a next button that also triggers a modal for continuing the activity -->
        <div class="col-12 p-3">
          <h2 class="text-primary text-capitalize">${activity.subHeading}</h2>
          <ul>
            ${activity.recognition
              .map((recognition) => {
                if (recognition.includes(":")) {
                  const [title, ...description] = recognition.split(": ");
                  return `<li><span class="fw-bold">${title}:</span> ${description.join(
                    ": "
                  )}</li>`;
                } else {
                  return `<li><span class="fw-bold">${recognition}</span></li>`;
                }
              })
              .join("")}
          </ul>
        </div>
      </div>
      <div class="activity-intro-footer row g-0">
        <div class="col-12">
          <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${
            activity.nextModal
          }">Next</a>
        </div>
      </div>
    </div>
    <!-- End of ${activity.title} Activity Details -->
  `;
};
/* Resource used (.map tactic):
https://docs.spring.io/spring-integration/reference/jdbc/outbound-channel-adapter.html 
The .map() method in JavaScript is a powerful function that executes a specified
 function on each element of an array and generates a new array from the results, 
leaving the original array unchanged. This method can perform a wide range of 
operations on array elements, from simple tasks like multiplying numbers to more 
complex processes like parsing strings or modifying the structure of objects. Its 
versatility makes it an essential tool for transforming data without altering the 
original dataset.

 */
let mailItems = [
  {
    id: 1,
    subject: "Weekly Newsletter",
    sender: "Bank Of Amerrica",
    senderEmail: "news@bankofamerrica.com",
    time: "5:00 PM",
    mailText:
      "Here's your monthly newsletter packed with exclusive offers, insightful articles, upcoming events, and special announcements. Stay tuned for exciting updates and valuable resources to enhance your experience!",
    url: "http://reliablesource.com/news",
    isPhishing: true,
  },
  {
    id: 2,
    subject: "Update Your Profile Picture",
    sender: "Software House",
    senderEmail: "abc@email.com",
    time: "6:00 PM",
    mailText: "Kindly update your profile pic...",
    url: "#",
    isPhishing: false,
  },
  // Add more mail items as needed
];

// create mail items html
const createMailItemsHTML = (mailItems) => {
  // Shuffle and slice the mailItems array to display only a specific number of emails
  shuffleArray(mailItems);
  mailItems = mailItems.slice(0, EMAIL_ITEM_LENGTH);
  let mailListing = document.querySelector(".mail-listing");
  // if mail listing is empty, return
  if (!mailListing) return; // Early exit if the container element does not exist
  mailListing.innerHTML = ""; // Clear existing mail items
  // Iterate over each mail item to create its HTML representation
  mailItems.forEach((item) => {
    let mailItem = document.createElement("div");
    mailItem.className = `mail-item mail-item-${item.id} row g-0 border-gray-5 border p-3`;
    mailItem.innerHTML = `
      <div class="col-md-1">
        <div class="mail-listing-checkbox">
          <input type="checkbox" id="mailListingItem${item.id}" />
        </div>
      </div>
      <div class="col-md-3">
        <div class="mail-title">
          <span class="fw-bold">${item.sender}</span>
        </div>
      </div>
      <div class="col-md-7">
        <div class="mail-subject">
          <span class="fw-bold">${item.subject.trim().substring(0, 20)}${
      item.subject.length > 20 ? "..." : ""
    }
          </span> - <span class="fw-normal">${item.mailText
            .trim()
            .substring(0, 32)}${item.mailText.length > 32 ? "..." : ""} </span>
        </div>
      </div>
      <div class="col-md-1">
        <div class="mail-date">${item.time}</div>
      </div>
    `; 
    // Compose the inner HTML for the mail item
    mailItem.addEventListener("click", function () {
      openMailItem(item); // Attach event listener to open detailed view
    });
    mailListing.appendChild(mailItem); // Append the new mail item to the container
  });
};

function createMailOpenViewHTML(item) {
  console.log("Running createMailOpenViewHTML");
  return `
      <div class="mail-open-view">
        <div class="row g-0">
          <div class="col-1 d-none d-md-block"></div>
          <div class="col-11">
            <div class="mail-subject mb-3">${item.subject}</div>
          </div>
        </div>
        <div class="row g-0">
          <div class="col-1 d-none d-md-block">
            <div class="user-profile">${item.sender.charAt(0)}</div>
          </div>
          <div class="col-6">
            <div class="mail-from">
              ${item.sender}
              <span class="sender-email">
                &lt;${item.senderEmail}&gt;
              </span>
              <div>
                to me
                <img
                  src="images/caret-down.svg"
                  alt="carret-down"
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
          <div class="col-4"></div>
          <div class="col-1 justify-content-center d-none d-md-block">
            <div class="mail-star-icon">
              <img
                src="images/star.svg"
                alt="mail-star"
                class="img-fluid"
              />
            </div>
          </div>
        </div>
        <div class="row g-0">
          <div class="col-1"></div>
          <div class="col-11">
            <div class="mail-content">
              <p>${item.mailText}</p>
              <p><a href="${item.url}">${item.url}</a></p>
            </div>
          </div>
        </div>
        <div class="row g-0">
          <div class="col-1"></div>
          <div class="col-11">
            <hr />
          </div>
          <div class="col-1"></div>

          <form id="isPhishingForm" class="row g-0" action="#">
                    <div class="col-11 mb-3 text-center">
            Is this email a phishing attempt or legitimate?
          </div>
                    <div class="col-6">
                      <div class="mail-quiz">
                        <div
                          class="form-check form-check-inline d-flex justify-content-center"
                        >
                          <input
                            class="form-check-input"
                            type="radio"
                            name="inlineRadioOptions"
                            id="mailQuizRadio1"
                            value="phishing"
                          />
                          <label
                            class="form-check form-check-label fw-bold ms-2 me-2 text-primary"
                            for="mailQuizRadio1"
                            >Phishing</label
                          >
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="mail-quiz">
                        <div
                          class="form-check form-check-inline d-flex justify-content-center"
                        >
                          <input
                            class="form-check-input"
                            type="radio"
                            name="inlineRadioOptions"
                            id="inlineRadio2"
                            value="legitimate"
                          />
                          <label
                            class="form-check form-check-label fw-bold ms-2 me-2 text-primary"
                            for="inlineRadio2"
                            >Legitimate</label
                          >
                        </div>
                      </div>
                    </div>
                    <div class="col-12 d-flex justify-content-center">
                      <button type="submit" class="btn btn-primary mt-3" onclick="emailPhishingValidator(event, ${
                        item.isPhishing
                      })">
                        Submit
                      </button>
                    </div>
                  </form>
                  <div
                      style="display: none;"
                      class="alert mt-3"
                      id="alert"
                      role="alert"
                    >
                      ${item.explanation}
                  </div>
                  <a id="goBackToEmailListingBtn" href="#" class="d-none btn btn-primary mt-3" onclick="goBackToEmailListing()">
                        Continue
                  </a>
        </div>
      </div>

  `;
} // Return the detailed view HTML with embedded JavaScript event handlers

const emailPhishingValidator = (event, isPhishing) => {
  event.preventDefault();
  const form = event.target.form;
  const formData = new FormData(form);
  const userSelection = formData.get("inlineRadioOptions");
  // remove the form
  form.remove();
  if (userSelection === "phishing" && isPhishing) {
    // display the alert
    document.getElementById("alert").style.display = "block";
    document.getElementById("alert").textContent =
      "Correct! You have successfully identified the phishing attempt.";
    // add class success
    document.getElementById("alert").classList.add("alert-success");
    // update score
    USER_SCORE.correct++;
    updateScore(USER_SCORE.correct, USER_SCORE.incorrect);
  } else if (userSelection === "legitimate" && !isPhishing) {
    // display the alert
    document.getElementById("alert").style.display = "block";
    document.getElementById("alert").textContent =
      "Correct! You have successfully identified the legitimate email.";
    // add class danger
    document.getElementById("alert").classList.add("alert-success");
    // update score
    USER_SCORE.correct++;
    updateScore(USER_SCORE.correct, USER_SCORE.incorrect);
  } else {
    // display the alert
    document.getElementById("alert").style.display = "block";
    // add class danger
    document.getElementById("alert").classList.add("alert-danger");
    // update score
    USER_SCORE.incorrect++;
    updateScore(USER_SCORE.correct, USER_SCORE.incorrect);
  }
  // remove the d-none from the goBackToEmailListingBtn
  document.getElementById("goBackToEmailListingBtn").classList.remove("d-none");
};
/*
Resource used (Score Handling):
https://stackoverflow.com/questions/68074211/make-score-counter-from-javascript-display-as-text-in-html
From score entry, this website allowed me to ensure that forms in my web applications are not 
only user-friendly but also secure and efficient in processing user data. This helped me 
implement user scores and correlate the users' correct/incorrect answers with their scores. I 
was also able to learn from different comments about potential errors and issues that could arise 
with scores. This knowledge helped me implement user scores displayed on the top right-hand 
side of the application after the user starts their first activity.
*/

const goBackToEmailListing = () => {
  // remove the mail-open-view
  document.querySelector(".mail-open-view").remove();
  // remove the d-none from the mail listing
  document.querySelector(".mail-listing").classList.remove("d-none");
  // check if there are any mail items in the mail-listing
  if (!document.querySelector(".mail-listing").hasChildNodes()) {
    // trigger the modal startPhishingQuizModal
    let startPhishingQuizModal = new bootstrap.Modal(
      document.getElementById("startPhishingQuizModal")
    );
    startPhishingQuizModal.show();
  }
};

// a function that will be added on the click event of the mail item
function openMailItem(item) {
  console.log("Running openMailItem");
  // remove the email item
  document.querySelector(`.mail-item-${item.id}`)?.remove();
  // create the mail open view html
  let mailOpenView = createMailOpenViewHTML(item);

  // hide the mail listing
  document.querySelector(".mail-listing").classList.add("d-none");

  // add a sibling to the mail listing
  document
    .querySelector(".mail-listing")
    .insertAdjacentHTML("afterend", mailOpenView);
}

const quizzes = {
  phishing: [
    {
      id: 1,
      question: "What is a common sign of a phishing email?",
      options: [
        "Unsolicited requests for personal information",
        "Regular newsletters",
        "Secure links",
        "Official company announcements",
      ],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "What is the primary goal of a phishing attack?",
      options: [
        "Installing antivirus software",
        "Revealing sensitive information",
        "Enhancing cybersecurity practices",
        " Creating strong passwords",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "In phishing attacks, attackers often disguise themselves as",
      options: [
        "Law enforcement officers",
        " Legitimate organizations",
        " Celebrities",
        " Fictional characters",
      ],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "What is a common method used in phishing attacks?",
      options: [
        "Sending emails from a seemingly trusted source",
        "Installing updated antivirus software",
        "Using strong passwords",
        "Avoiding public Wi-Fi networks",
      ],
      correctAnswer: 0,
    },
    {
      id: 5,
      question: "What should you do if you receive a phishing email?",
      options: [
        "Click on the link in the email",
        "Reply to the email",
        "Forward the email to your contacts",
        "Report the email to your IT department or email provider",
      ],
      correctAnswer: 3,
    },
    {
      id: 6,
      question: "What information do phishing emails often ask for?",
      options: [
        "Your favorite color",
        "Your opinion on a topic",
        "Your personal or financial information",
        "Your favorite movie",
      ],
      correctAnswer: 2,
    },
  ],
  passwordSecurity: [
    {
      id: 1,
      question: "What is a strong password characterized by?",
      options: [
        "Short and easy to remember",
        "Includes a combination of uppercase and lowercase letters, numbers, and special characters",
        "Contains personal information like name or birthdate",
        "None of the above",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Why is it important to avoid using common passwords?",
      options: [
        "Common passwords are easy to remember",
        "Common passwords are difficult for hackers to guess",
        "Hackers often use automated tools to crack common passwords",
        "Common passwords provide better security",
      ],
      correctAnswer: 2,
    },
    {
      id: 3,
      question:
        "What is the significance of using salt when hashing passwords?",
      options: [
        "Salting adds random data to each password before hashing, making it more difficult for attackers to use precomputed tables like rainbow tables.",
        "Salting ensures that passwords are encrypted using a unique algorithm.",
        "Salting prevents passwords from being stored in plaintext.",
        "Salting increases the length of the password, making it more secure against brute force attacks.",
      ],
      correctAnswer: 0,
    },
    {
      id: 4,
      question: "What is the purpose of multi-factor authentication (MFA)?",
      options: [
        "To make login processes more complicated",
        "To simplify the login process",
        "To provide an additional layer of security by requiring multiple forms of identification",
        "To encrypt passwords using multiple algorithms",
      ],
      correctAnswer: 2,
    },
    {
      id: 5,
      question: "What is a phishing attack?",
      options: [
        "A physical break-in to steal passwords",
        "A type of social engineering attack where attackers impersonate legitimate entities to trick individuals into providing sensitive information",
        "A type of malware that encrypts files and demands payment for decryption",
        "A form of network intrusion where attackers intercept and alter data transmissions",
      ],
      correctAnswer: 1,
    },
    {
      id: 6,
      question: "What does SSL/TLS encryption primarily protect against?",
      options: [
        "Physical theft of data",
        "Malware infections",
        "Unauthorized access to transmitted data",
        "Hardware failures",
      ],
      correctAnswer: 2,
    },
  ],
  onlineSafety: [
    {
      id: 1,
      question: "What is online bullying also commonly known as?",
      options: [
        "Cyberbullying",
        "Digital harassment",
        "Social media trolling",
        "Internet shaming",
      ],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "Which of the following is a form of cyberbullying?",
      options: [
        "Sending a friendly message to a friend on social media",
        "Leaving positive comments on someone's posts",
        "Sharing embarrassing photos or videos of someone without their consent",
        "Participating in a group chat to plan a surprise party",
      ],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: "Why is it important to report instances of cyberbullying?",
      options: [
        "To get more likes and attention",
        "To escalate the situation",
        "To seek revenge",
        "To protect oneself and others from harm",
      ],
      correctAnswer: 3,
    },
    {
      id: 4,
      question: "What should you do if you witness cyberbullying online?",
      options: [
        "Ignore it and hope it goes away",
        "Join in to fit in with others",
        "Speak up and support the victim",
        "Laugh along to avoid becoming a target",
      ],
      correctAnswer: 2,
    },
    {
      id: 5,
      question:
        "Which of the following actions can help prevent cyberbullying?",
      options: [
        "Sharing personal information online",
        "Being mindful of the impact of your words and actions",
        "Ignoring people who are being bullied",
        "Engaging in negative online behavior",
      ],
      correctAnswer: 1,
    },
    {
      id: 6,
      question:
        "What are some signs that someone may be experiencing cyberbullying?",
      options: [
        "Increased confidence and self-esteem",
        "Avoidance of social situations",
        "Expressing happiness and contentment online",
        "Healthy relationships with peers",
      ],
      correctAnswer: 1,
    },
  ],
};

/*
Resource Used (Phishing Quiz): 
https://www.checkpoint.com/cyber-hub/threat-prevention/what-is-phishing/ 
I used this website to write information about phishing for my quizzes and to provide options 
and answers for users. Since I also used this website to write information, it helped me craft the 
way I wanted to write the quizzes and phrase the answers after the activity. This helped me 
understand common phishing threats and formulate questions for the quizzes based on what I 
learned and my prior knowledge."

Resource used (Password Quiz):
https://www.popsci.com/how-to-choose-safe-passwords/ 
I used this website to create quizzes, ask questions, and provide options about choosing safe 
passwords, as well as to share information. I made this quiz more detail-oriented because it is 
knowledge-based. For instance, I wrote about salting and hashing, which I included in the 
information provided. This ensures that users have read the blurb posted before starting the 
activity.

Resource used (Online Saftey Quiz):
https://www.washington.edu/doit/online-safety-tips-protecting-your-personal-information#:~:text=No%20one%20needs%20to%20know,be%20used%20by%20online%20predators. 
I used this website to facilitate my quizzes on how to tell users how to communicate online.
 Like the password quiz, I made this one more knowledge-based, and I designed the questions 
 to be more challenging in terms of reading the instructions and not just participating in the activities. 
 This approach ensures that users are educated about the topic at hand.

*/

//add an onclick event listener on quiz-submit
const quizFormHandler = (id) => {
  // Get the selected radio button
  const selectedOption = document.querySelector(
    'input[name="optionRadio"]:checked'
  );
  // Alert and exit if no option is selected
  if (!selectedOption) {
    alert("Please select an option");
    return;
  }
  // add d-none to quiz-submit
  document.querySelector(".quiz-submit").classList.add("d-none");
  // remote the d-none from quiz-next
  document.querySelector(".quiz-next").classList.remove("d-none");

  // Perform some action based on the selected value
  if (selectedOption.id === "optionRadio" + id) {
    // Apply success styling and update score for a correct answer
    selectedOption.parentElement.parentElement.classList.add("border-success");
    selectedOption.parentElement.parentElement.classList.remove(
      "border-danger"
    );
    // update the score
    USER_SCORE.correct++;
    updateScore(USER_SCORE.correct, USER_SCORE.incorrect);
  } else {
    // Apply error styling and update score for an incorrect answer
    selectedOption.parentElement.parentElement.classList.add("border-danger");
    selectedOption.parentElement.parentElement.classList.remove(
      "border-success"
    );
    // update the score
    USER_SCORE.incorrect++;
    updateScore(USER_SCORE.correct, USER_SCORE.incorrect);
  }
};

function shuffleArray(array) 
{
  // Validate array input
  if (array === null || array.length === undefined) 
  {
    console.error("Invalid.");
    return; // Exit the function if the array is invalid
  }
  // Shuffle array using concept from Fisher-Yates (Durstenfeld) algorithm, but broke down
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    // Swap elements
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;  }
}
/*
Resources used (shuffling an array): 
https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array 
https://www.geeksforgeeks.org/shuffle-a-given-array-using-fisher-yates-shuffle-algorithm/

The first website gave me a general idea of how to create my shuffleArray() function, 
which is one of the main functions I'm using for the randomization of elements in 
my array. After further research, I learned about a function I could use for this 
purpose: the Fisher-Yates (or Knuth) Shuffle algorithm in JavaScript, as explained by 
the second website. This algorithm is a standard solution for generating a random 
permutation of a finite sequence—in this case, shuffling the elements of an array. 
By progressively and randomly selecting elements from the array and swapping 
them with elements in positions that haven't yet been iterated over, the algorithm 
ensures that each permutation of the array is equally likely.
*/


function startQuiz(quizKey, completionModal) {
  currentQuizKey = quizKey;
  console.log("Starting quiz with key:", quizKey);
  // add d-none to emailSection
  document.getElementById("emailSection")?.classList.add("d-none");
  // remove the d-none from scoreBoxContainer
  document.getElementById("scoreBoxContainer")?.classList.remove("d-none");
  // remove the d-none from quizContainer
  document.getElementById("quizContainer")?.classList.remove("d-none");
  // add class question-image to body
  document.body.classList.add("question-image");
  // Shuffle Quizzes
  // quizzes[quizKey].sort(() => Math.random() - 0.5);
  shuffleArray(quizzes[quizKey]);
  CURRENT_QUESTION_INDEX = 0; // Reset the current question index
  displayNextQuestion(completionModal);
}

// next question
function displayNextQuestion(completionModal) {
// log statements for debugging
  console.log("Displaying next question");
  console.log("ON Complete: ", completionModal);
// Get the container where the quiz form and options are displayed
  const questionContainer = document.getElementById("quizForm");
// Clear any existing content in the container
  questionContainer.innerHTML = "";
  if (CURRENT_QUESTION_INDEX < QUIZ_LENGTH) {
    const randomQuestion = quizzes[currentQuizKey][CURRENT_QUESTION_INDEX];
    // Set up the question HTML structure
    questionContainer.innerHTML = `             
               <div class="quiz-section text-left">
                  <div class="question mt-4 mb-4">
                    <p>${randomQuestion.question}</p>
                </div>
                       <!-- Options -->
                <div class="options mb-4"></div>`;
    // Initialize variable to accumulate options HTML
    let optionsHtml = "";
    randomQuestion.options.forEach((option, index) => {
      optionsHtml += `
               <div class="option border p-3 shadow-sm my-3">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="optionRadio"
                        id="optionRadio${index}"
                      />
                      <label class="form-check-label" for="optionRadio${index}">
                        ${option}
                      </label>
                    </div>
               </div>
                  `;
    });
/*
Resource Used (CSS Tricks for Toggling Visibility):
https://css-tricks.com/snippets/css/toggle-visibility-when-hiding-elements/
This snippet from CSS-Tricks proved invaluable for mastering different techniques to toggle the 
visibility of elements in a user interface. It enabled me to implement dynamic UI features where 
elements can be shown or hidden based on user actions or other application states, thereby 
enhancing both the usability and aesthetic appeal of the interfaces I develop.
*/

    let quizNavigation = `
               <!-- Quiz Navigation -->
              <div class="navigation d-flex justify-content-between w-100">
                <a
                  href="#"
                  class="btn btn-primary quiz-submit"
                  onclick="quizFormHandler(${randomQuestion.correctAnswer})"
                  >Submit</a
                >
                <a href="#" class="d-none btn btn-primary quiz-next" onclick="displayNextQuestion('${completionModal}')">Next</a>
              </div>
      `;
    // injects the generated navigation buttons along with the question options into the options container.
    questionContainer.querySelector(".options").innerHTML =
      optionsHtml + quizNavigation;
   // increments the index to keep track of the current question
    CURRENT_QUESTION_INDEX++;
    // update the score
    updateScore(USER_SCORE.correct, USER_SCORE.incorrect);
  } else {
    // All questions for the current quiz are completed
    //  show the completePhishingTask modal
    console.log("Showing modal");
    console.log("Showing modal", completionModal);
    let modal = new bootstrap.Modal(document.getElementById(completionModal));
    console.log("Showing modal", modal);
    modal.show();
    // add d-none to quizContainer
    document.getElementById("quizContainer").classList.add("d-none");
    // Reset the currentQuestionIndex when all questions are completed
    CURRENT_QUESTION_INDEX = 0;
  }
}

function validatePassword() 
{
  let password = document.getElementById("password").value;
  if (password.trim() === "") {
    alert("Please enter a password");
    return;
  }
  PASSWORD_ATTEMPTS++;
  // tracks the number of password attempts.
  PASSWORDS.push(password); 
  // stores the password attempt in an array for comparison.
  console.log("Validating password");
  // add d-none to verifyPasswordButton
  document.getElementById("verifyPasswordButton").classList.add("d-none");
  // remove d-none from clearPasswordButton
  document.getElementById("clearPasswordButton").classList.remove("d-none");

  let errors = [];

  // check if the old password is the same as the new password
  if (PASSWORDS.length > 1 && PASSWORDS[PASSWORDS.length - 1] === PASSWORDS[PASSWORDS.length - 2]) 
  {
    errors.push("Password should not be the same as the previous password.");
  }

  // ensures the password does not contain spaces
  if (password.includes(" "))
  {
  errors.push("Password should not contain a space.");
  }
// list of generic words and sequences that passwords should avoid
const genericWords = ["hello", "welcome", "querty", "login", "football", "basketball", "passwords",
 "flower", "passw0rd", "pass", "world", "1234", "123", "abc", "bob", "jones", "billy",
"okay", "hi", "p@ss", "asdfgh", "zxcvbnm", "uiop", "apr", "jan", "feb", "march", "june",
"jul", "aug", "sep", "oct", "nov", "dec", "408", "gmail", "650", "sunshine", 
"baseball", "soccer", "swimming", "sunshine", "princess", "love", "potato", "opensesame",
"lol", "lmao", "letmein", "asdf", "111", "222", "333", "444", "555", "666", "777","888", "999",
"omg", "summer", "winter", "christmas", "halloween", "spring", "fall", "superman", "batman",
"amor", "google", "microsoft", "apple", "facebook", "tiktok", "instagram", "meta", "twitter",
"maytheforce", "monkey", "2023", "2024", "admin", "!@#$%", "dog", "cat", "elephant", "lion", 
"chair", "table", "lamp", "phone", "laptop", "book", "music", "photography", "cook", "paris",
"london", "newyork", "tokyo", "john", "mary", "david", "sarah", "emily", "mike", "micheal", 
"harrypotter", "starwars", "gameofthrones", "avengers", "pizza", "coffee", "chocolate", "icecream", 
"sushi", "burger", "greatwall", "tajmahal", "jkrowling", "hola", "bonjour", "ciao", "adios", "smh",
"tbh", "minecraft", "fortnite", "callofduty", "leagueoflegends", "einstein", "napolean",
"lincoln", "cleopatra", "hakunamatata", "jazz", "rock", "pop", "meeting", "deadline", "exam",
"project", "report", "awesome", "great", "amazing", "cool", "alright", "wow", "woah", "jesus", "case"
]

// check if password contains any generic words or common sequences
if (genericWords.some(word => password.toLowerCase().includes(word.toLowerCase()))) {
  errors.push("Passwords should not contain generic words or number sequences.");
}
// additional password strength criteria 
  if (password.length < 8) {
    errors.push("Password should be at least 8 characters long.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password should contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password should contain at least one lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password should contain at least one digit.");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(
      "Password should contain at least one special character (!@#$%^&*)."
    );
  }
  // check if password includes segments of the user's username
  for (let i = 0; i < USERNAME.length - 2; i++) {
    const usernameSubstring = USERNAME.substring(i, i + 3).toLowerCase();
    if (password.toLowerCase().includes(usernameSubstring)) {
      errors.push("Password should not contain any three consecutive letters of your username.");
      break;
    }
  }
/*
Resource Used (JavaScript Validation):
https://www.w3schools.com/js/js_validation.asp
The JavaScript validation guide on W3Schools helped me implement client-side form validation. 
It provided clear examples and best practices that I employed to ensure data integrity and 
validate user input before forms are submitted to the server. This approach not only improves
user experience by catching errors early but also reduces the load on server-side processing, 
which is crucial for maintaining performance in high-traffic applications.
*/

/* 
  Resource Used (password security):
  https://www.security.org/how-secure-is-my-password/
  This website provided an invaluable tool for understanding the security level of passwords. By analyzing how 
  quickly a password can potentially be cracked based on its complexity, it helped me implement an interactive password 
  strength meter on my web applications. This feature actively encourages users to choose stronger, more secure passwords
  by visually indicating the strength of their password as they type. Integrating these insights helps in preventing
  the use of weak passwords, significantly enhancing the security of user accounts against brute-force attacks. I did notice, 
  however, how common phrases, like "hello" and "123" were considered "strong enough." I decided to tackle this error by
  not giving users points if they inputted common phrases.
 */

/*
  Resource Used (password validator):
  https://github.com/mattt/Navajo
  Navajo's library for password validation provided a robust framework for assessing password strength in 
  user registrations and change password features. By leveraging its extensive library of rules and validations,
  I ensured that users create strong, secure passwords that are resistant to common attacks like brute force.
  Integrating Navajo provided a structured approach to password strength validation, which has been crucial
  in maintaining high security standards for user authentication processes.
 */

  if (errors.length > 0) {
    // passwordStrengthProgressBar
    document.getElementById("passwordStrengthProgressBar").style.width =
      100 - errors.length * 20 + "%";
    // update score
    USER_SCORE.incorrect++;
    updateScore(USER_SCORE.correct, USER_SCORE.incorrect);
    // display the errors #passwordError
    document.getElementById("passwordError").innerHTML = errors
      .map((error) => `${error}<br>`)
      .join("");
    // remove d-none from passwordError
    document.getElementById("passwordError").classList.remove("d-none");
  } else {
    // passwordStrengthProgressBar
    document.getElementById("passwordStrengthProgressBar").style.width = "100%";
    // add score to the user
    USER_SCORE.correct++;
    updateScore(USER_SCORE.correct, USER_SCORE.incorrect);
    // add d-none to passwordError
    document.getElementById("passwordError").classList.add("d-none");
    // remove d-none from passwordSuccess
    document.getElementById("passwordSuccess").classList.remove("d-none");
  }
}

const clearPassword = () => {
  document.getElementById("password").value = "";
  document.getElementById("passwordStrengthProgressBar").style.width = "0%";
  // add d-none to clearPasswordButton
  document.getElementById("clearPasswordButton").classList.add("d-none");
  // remove d-none from verifyPasswordButton
  document.getElementById("verifyPasswordButton").classList.remove("d-none");
  // Add d-none to passwordError
  document.getElementById("passwordError").classList.add("d-none");
  // Add d-none to passwordSuccess
  document.getElementById("passwordSuccess").classList.add("d-none");

  if (PASSWORD_ATTEMPTS == MAX_PASSWORD_ATTEMPTS) {
    PASSWORD_ATTEMPTS = 0;
    PASSWORDS = [];
    //updating progress here
    updateProgress(50.1);
    // show the startPasswordSecurityQuizModal modal
    let completePasswordSecurityTaskModal = new bootstrap.Modal(
      document.getElementById("startPasswordSecurityQuizModal")
    );
    completePasswordSecurityTaskModal.show();
    return;
  }
};

// toggle password visibility
function togglePasswordVisibility() {
  let passwordInput = document.getElementById("password");
  let passwordVisibilityToggle = document.getElementById("togglePassword");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    // change the bi-eye-slash to bi-eye
    passwordVisibilityToggle.innerHTML = `<i class="bi bi-eye"></i>`;
  } else {
    passwordInput.type = "password";
    // change the bi-eye to bi-eye-slash
    passwordVisibilityToggle.innerHTML = `<i class="bi bi-eye-slash"></i>`;
  }
}

// chat-reply-option
const selectChatReplyOption = (option) => {
  // set chat-reply text to the selected option
  document.querySelector(".chat-reply").textContent = option;
  // console log
  console.log("selectChatReplyOption: ", option);
};

// array of chat questions
const CHAT_QUESTIONS = [
  {
    question: "How much money do you make?",
    options: [
      "I do not feel comfortable sharing this information.",
      "I make $1000 a month.",
    ],
    correctAnswer: "I do not feel comfortable sharing this information.",
  },

  {
    question: "What is your mother's maiden name?",
    options: ["Smith.", "I am not comfortable sharing this information."],
    correctAnswer: "I am not comfortable sharing this information.",
  },
];

const NEW_QUESTIONS = [
  {
    question: "What is your favorite color?",
    options: [
      "Blue",
      "Red! Just like the shirt I lost at the busy Starlight Café on Main Street last Thursday around 7 PM :(."
    ],
    correctAnswer: "Blue"
  },
  {
    question: "Where were you born?",
    options: [
      "City A",
      "City B",
      "City C",
      "Prefer not to disclose"
    ],
    correctAnswer: "Prefer not to disclose"
  }
];

// append new questions to the existing array
CHAT_QUESTIONS.push(...NEW_QUESTIONS);

// update the maximum number of chat questions
let MAX_CHAT_QUESTIONS = 3;
let CURRENT_CHAT_QUESTION_INDEX = 0;

function displayChatQuestion() {
  const question = CHAT_QUESTIONS[CURRENT_CHAT_QUESTION_INDEX];
  let optionsHTML = "";
  // loops through each option of the current question  
  // constructs the HTML for radio buttons
  question.options.forEach((option, index) => {
    optionsHTML += `
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          id="option${index + 1}"
          name="chatReply"
          value="${option}"
          onclick="selectChatReplyOption(this.value)"
        />
        <label class="form-check-label" for="option${index + 1}">
          ${option}
        </label>
      </div>
    `;
  });
  // Builds the HTML for displaying the question, the options, and buttons for interaction
  let html = `
    <div class="chat-question">${question.question}</div>
    <div class="chat-reply">...</div>
    <hr />
    <form id="chatReplyForm" class="form">
      ${optionsHTML}
    </form>
    <button
      id="validateChatReplyButton"
      onclick="validateChatReply('${question.correctAnswer}')"
      class="btn btn-secondary mt-3 shadow-sm"
    >
      Check Answer
    </button>
    <button
      id="nextChatButton"
      onclick="nextChatQuestion('startOnlineSafetyQuizModal')"
      class="d-none btn btn-primary mt-3 shadow-sm"
    >
      Next
    </button>
  `;
  // display the current question and options (inject HTML into element w/ class 'chat-window')
  document.querySelector(".chat-window").innerHTML = html;
}
/*
Resource Used (JavaScript Events):
https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events
This comprehensive guide on MDN about JavaScript events helped me understand how
to dynamically handle user interactions. By learning about different types of events and their
specific applications, I was able to enhance web page interactivity. My pages now respond in 
real-time to user inputs like clicks, mouse movements, and keyboard actions, which 
boosts the application's interactivity aspect.
*/

// validateChatReply
const validateChatReply = (correctAnswer) => {
// Retrieve the text content of the chat reply element
// Check if the reply is still in its placeholder state indicating no selection
  const chatReply = document.querySelector(".chat-reply").textContent;
  if (chatReply.trim() === "...") {
    alert("Please select an option");
    return;
  }
  // add d-none to validateChatReplyButton
  document.getElementById("validateChatReplyButton").classList.add("d-none");
  // add d-none to chatReplyForm
  document.getElementById("chatReplyForm").classList.add("d-none");

  if (correctAnswer == chatReply) {
    // update the score
    USER_SCORE.correct++;
    updateScore(USER_SCORE.correct, USER_SCORE.incorrect);
    // add bg-success to chat-reply
    document.querySelector(".chat-reply").classList.add("bg-success");
  } else {
    // update the score
    USER_SCORE.incorrect++;
    updateScore(USER_SCORE.correct, USER_SCORE.incorrect);
    // add bg-danger to chat-reply
    document.querySelector(".chat-reply").classList.add("bg-danger");
  }
  // remove d-none from nextChatButton
  document.getElementById("nextChatButton").classList.remove("d-none");
};

// nextChatQuestion
const nextChatQuestion = (completionModal) => {
  // add d-none to nextChatButton
  document.getElementById("nextChatButton").classList.add("d-none");
  // remove d-none from chatReplyForm
  document.getElementById("chatReplyForm").classList.remove("d-none");
  // remove bg-success from chat-reply
  document.querySelector(".chat-reply").classList.remove("bg-success");
  // remove bg-danger from chat-reply
  document.querySelector(".chat-reply").classList.remove("bg-danger");
  // clear the chat-reply
  document.querySelector(".chat-reply").textContent = "...";
  if (CURRENT_CHAT_QUESTION_INDEX == MAX_CHAT_QUESTIONS - 1) {
    //updating progress here
    updateProgress(83.5);
    CURRENT_CHAT_QUESTION_INDEX = 0;
    // show the completionModal
    let modal = new bootstrap.Modal(document.getElementById(completionModal));
    modal.show();
    return;
  }
  // increment the CURRENT_CHAT_QUESTION_INDEX
  CURRENT_CHAT_QUESTION_INDEX++;
  // display the next question
  displayChatQuestion();
};
/*
 Resource Used (Example Chat Bot on GitHub):
 https://github.com/TimRobinson1/simplified-chat-bot
 By studying this GitHub repository, I gained insights into the architecture and coding patterns used in building
 a simplified chat bot. This resource was particularly useful in understanding how to structure and implement 
 a basic chat (using conditionals) that can interact with users, parse their inputs, and provide relevant responses, enhancing 
 the interactivity and engagement of applications.
 */

/*
  Resource Used (Building a Chat Application): https://socket.io/get-started/chat
  This tutorial on creating a real-time chat application using Socket.io was pivotal in my understanding of 
  real-time web technologies. It helped me understand the fundamentals of WebSocket and the specifics of using Socket.io
  to facilitate bi-directional communication between the server and clients in real-time. Although my chat 
  activity wasn't in real-time, it helped me form and organize the structure of my code surrounding this activity.
 */

// create a main function that will handle all stuff
const MAIN = () => {
// Call createMailItemsHTML function to render mail items based on the mailItems data.
  createMailItemsHTML(mailItems);
  // prepend modals to the body
  document.body.innerHTML += Object.values(modals)
    .map((modal) => createModalHTML(modal))
    .join("");
  // prepend activities to the body
  // Generate and append HTML for all activity intros defined in the 'activitiesIntro' object.
  document.body.innerHTML += Object.values(activitiesIntro)
    .map((activity) => createActivityIntroHTML(activity))
    .join("");
};
window.onload = MAIN;

// Function to evaluate user progress and score, and potentially display the certificate if criteria are met.
function getCertificate() {
  if (PROGRESS >= 100) {
    let totalScore = USER_SCORE.correct + USER_SCORE.incorrect;
     // Calculate the percentage of correct answers
    let userScorePercentage = Math.round(
      (USER_SCORE.correct / totalScore) * 100
    );
    // Check if the user's score meets the minimum score percentage required for certification
    if (userScorePercentage >= MIN_SCORE_PERCENTAGE) {
      // display certificate
      console.log("Certificate");
      let certificateContentElement =
        document.getElementById("certificateContent");
      let savePdfElement = document.getElementById("save-pdf");
      if (certificateContentElement && savePdfElement) {
        // remove d-none from certificateContentElement and savePdfElement
        document
          .getElementById("certificateContent")
          .classList.remove("d-none");
          // Remove the 'question-image' class from the body to clean up the background
        document.getElementById("save-pdf").classList.remove("d-none");
        // remove question-image from body
        document.body.classList.remove("question-image");
      } else {
       // Log an error if the elements were not found in the DOM
        console.error(
          "Elements with id 'certificateContent' or 'save-pdf' were not found"
        );
      }
    } else {
      // If the user does not meet the score criteria, display the certificate eligibility modal
      let modalElement = document.getElementById(
        "certificateEligibilityCriteria"
      );
      let modal = new bootstrap.Modal(modalElement);
      modal.show(); // Use Bootstrap's Modal component to show the eligibility criteria
    }
  }
}
// * Function to initiate printing of the current window, typically used to save the displayed certificate as a PDF.
const savePDF = () => {
  window.print();
};
/*
Website used (downloading a page):
https://ironpdf.com/nodejs/blog/node-pdf-tools/javascript-print-pdf-tutorial/
This website helped me decide what to use to allow the user to save the PDF and also print 
it if they wanted to.
*/