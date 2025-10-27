var languageContent = {
  greek: {
    languageBtn: "EL",
    mainTitle: "Άδεια Προσωρινού Παρκαρίσματος Ειδικών Περιπτώσεων",
    pageTitle: "Άδεια Προσωρινού Παρκαρίσματος Ειδικών Περιπτώσεων",
    infoTitle: "Πληροφορίες για τη χορήγηση προσωρινών αδειών στάθμευσης για ειδικές περιπτώσεις",
    subTitle1: "Το ερωτηματολόγιο σας βοηθά να δείτε αν δικαιούστε προσωρινή άδεια παρκαρίσματος λόγω ειδικών περιστάσεων.",
    subTitle2: "Η συμπλήρωση δεν απαιτεί παραπάνω από 10 λεπτά.",
    subTitle3: "Οι απαντήσεις σας δεν αποθηκεύονται ή κοινοποιούνται.",
  },
  english: {
    languageBtn: "EN",
    mainTitle: "Special Case Temporary Parking Permit",
    pageTitle: "Special Case Temporary Parking Permit",
    infoTitle: "Information on applying for special case temporary parking permits",
    subTitle1: "This questionnaire helps you determine if you are eligible for a temporary parking permit under special circumstances.",
    subTitle2: "Completing the questionnaire should take less than 10 minutes.",
    subTitle3: "Your answers will not be stored or shared.",
  }
};

  
var currentLanguage = localStorage.getItem("preferredLanguage") || "greek";

function toggleLanguage() {
    currentLanguage = currentLanguage === "greek" ? "english" : "greek";
    localStorage.setItem("preferredLanguage", currentLanguage);
    updateContent();
}

function updateContent() {
    var components = document.querySelectorAll(".language-component");
     
    components.forEach(function (component) {
        var componentName = component.dataset.component;
        component.textContent = languageContent[currentLanguage][componentName];
    });
}

updateContent();