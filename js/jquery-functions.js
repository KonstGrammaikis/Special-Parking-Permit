$("document").ready(function () {
  var currentQuestion = 0;
  var totalQuestions = 0;
  var userAnswers = {};
  var all_questions;
  var all_questions_en;
  var all_evidences;
  var all_evidences_en;
  var faq;
  var faq_en;

  function hideFormBtns() {
    $("#nextQuestion").hide();
    $("#backButton").hide();
  }

  function isLLMFormat(data) {
    return data.length && data.some(q => q.result !== undefined || q.required_documents !== undefined);
  }

  function getQuestions() {
    return fetch("question-utils/questions_llm2.json")
      .then((response) => response.json())
      .then((data) => {
        all_questions = data;
        totalQuestions = data.length;
        window._jsonFormatIsLLM = isLLMFormat(data);

        return fetch("question-utils/all-questions-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_questions_en = dataEn;
          })
          .catch((error) => {
            const errorMessage = document.createElement("div");
            errorMessage.textContent =
              "Error: Failed to fetch all-questions-en.json.";
            $(".question-container").html(errorMessage);
            hideFormBtns();
          });
      })
      .catch((error) => {
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch all-questions.json.";
        $(".question-container").html(errorMessage);
        hideFormBtns();
      });
  }

  function getEvidences() {
    return fetch("question-utils/cpsv.json")
      .then((response) => response.json())
      .then((data) => {
        all_evidences = data;
        return fetch("question-utils/cpsv-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_evidences_en = dataEn;
          });
      });
  }

  function getFaq() {
    return fetch("question-utils/faq.json")
      .then((response) => response.json())
      .then((data) => {
        faq = data;
        return fetch("question-utils/faq-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            faq_en = dataEn;
          });
      });
  }

  function loadFaqs() {
    var faqData = currentLanguage === "greek" ? faq : faq_en;
    var faqTitle =
      currentLanguage === "greek"
        ? "Συχνές Ερωτήσεις"
        : "Frequently Asked Questions";

    var faqElement = document.createElement("div");

    faqElement.innerHTML = `
        <div class="govgr-heading-m language-component" data-component="faq" tabIndex="15">
          ${faqTitle}
        </div>
    `;

    var ft = 16;
    if (faqData && faqData.length) {
      faqData.forEach((faqItem) => {
        var faqSection = document.createElement("details");
        faqSection.className = "govgr-accordion__section";
        faqSection.tabIndex = ft;

        faqSection.innerHTML = `
          <summary class="govgr-accordion__section-summary">
            <h2 class="govgr-accordion__section-heading">
              <span class="govgr-accordion__section-button">${faqItem.question}</span>
            </h2>
          </summary>
          <div class="govgr-accordion__section-content">
            <p class="govgr-body">${faqItem.answer}</p>
          </div>
        `;

        faqElement.appendChild(faqSection);
        ft++;
      });
    }

    $(".faqContainer").html(faqElement);
  }

  function showResultFromLLMJson(finalQuestion) {
    $(".question-container").empty();
    const title = document.createElement("h2");
    title.textContent = "Eligibility Result";
    $(".question-container").append(title);

    if (finalQuestion.message) {
      const msg = document.createElement("div");
      msg.className = "govgr-body";
      msg.textContent = finalQuestion.message;
      $(".question-container").append(msg);
    }
    if (finalQuestion.required_documents && finalQuestion.required_documents.length > 0) {
      const docHeader = document.createElement("h5");
      docHeader.textContent = "Required documents:";
      $(".question-container").append(docHeader);
      const docs = document.createElement("ul");
      finalQuestion.required_documents.forEach(function(doc) {
        const li = document.createElement("li");
        li.textContent = doc;
        docs.appendChild(li);
      });
      $(".question-container").append(docs);
    }
    hideFormBtns();
  }

  function showResultFromOldFormat(allAnswers) {
    const resultWrapper = document.createElement("div");
    const titleText =
      currentLanguage === "greek"
        ? "Αποτέλεσμα αίτησης"
        : "Application Result";
    resultWrapper.innerHTML = `<h1 class='answer'>${titleText}</h1>`;
    resultWrapper.setAttribute("id", "resultWrapper");
    $(".question-container").html(resultWrapper);

    if (
      allAnswers[0] === "Εκδήλωση (πολιτιστική/κοινωνική)" &&
      (allAnswers[1] === "Μία εβδομάδα" || allAnswers[1] === "Ένας μήνας")
    ) {
      setResult(
        currentLanguage === "greek"
          ? "Για εκδηλώσεις άνω της μίας μέρας απαιτούνται επιπλέον δικαιολογητικά. Ελέγξτε τις οδηγίες της υπηρεσίας."
          : "Events longer than one day require extra documentation. Please check the service instructions."
      );
    } else if (allAnswers[0] === "ΑΜΕΑ" && allAnswers[4] === "Ναι") {
      setResult(
        currentLanguage === "greek"
          ? "Δικαιούστε άδεια στάθμευσης με πρόσβαση σε ράμπα λόγω ΑΜΕΑ. Καταθέστε τα δικαιολογητικά."
          : "You are eligible for parking with ramp access due to disability. Please provide the necessary documents."
      );
    } else if (
      allAnswers[3] === "Ναι" &&
      allAnswers[2] === "Κεντρική ζώνη"
    ) {
      setResult(
        currentLanguage === "greek"
          ? "Η προσωρινή άδεια επαγγελματικού οχήματος σε κεντρική ζώνη υπόκειται σε περιορισμούς. Ελέγξτε τους όρους."
          : "Temporary professional vehicle permits in the central area are subject to restrictions. Please check the terms."
      );
    } else {
      setResult(
        currentLanguage === "greek"
          ? "Η αίτησή σας καταχωρήθηκε και θα αξιολογηθεί σύντομα."
          : "Your application has been submitted and will be reviewed shortly."
      );
    }

    const evidenceListElement = document.createElement("ol");
    evidenceListElement.setAttribute("id", "evidences");
    $(".question-container").append(evidenceListElement);

    currentLanguage === "greek"
      ? $(".question-container").append(
          "<br /><br /><h5 class='answer'>Δικαιολογητικά για τη συγκεκριμένη περίπτωση</h5><br />"
        )
      : $(".question-container").append(
          "<br /><br /><h5 class='answer'>Required documents for your case</h5><br />"
        );

    getEvidencesById(1);
    hideFormBtns();
  }

  function loadQuestion(questionId, noError) {
    $("#nextQuestion").show();
    if (currentQuestion > 0) {
      $("#backButton").show();
    }

    currentLanguage === "greek"
      ? (question = all_questions[questionId])
      : (question = all_questions_en[questionId]);
    var questionElement = document.createElement("div");

    if (noError) {
      questionElement.innerHTML = `
                <div class='govgr-field'>
                    <fieldset class='govgr-fieldset' aria-describedby='radio-country'>
                        <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
                            ${question.question}
                        </legend>
                        <div class='govgr-radios' id='radios-${questionId}'>
                            <ul>
                                ${question.options
                                  .map(
                                    (option, index) => `
                                    <div class='govgr-radios__item'>
                                        <label class='govgr-label govgr-radios__label'>
                                            ${option}
                                            <input class='govgr-radios__input' type='radio' name='question-option' value='${option}' />
                                        </label>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </ul>
                        </div>
                    </fieldset>
                </div>
            `;
    } else {
      questionElement.innerHTML = `
            <div class='govgr-field govgr-field__error' id='${questionId}-error'>
            <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
                        ${question.question}
                    </legend>
                <fieldset class='govgr-fieldset' aria-describedby='radio-error'>
                    <legend  class='govgr-fieldset__legend govgr-heading-m language-component' data-component='chooseAnswer'>
                        Επιλέξτε την απάντησή σας
                    </legend>
                    <p class='govgr-hint language-component' data-component='oneAnswer'>Μπορείτε να επιλέξετε μόνο μία επιλογή.</p>
                    <div class='govgr-radios id='radios-${questionId}'>
                        <p class='govgr-error-message'>
                            <span class='govgr-visually-hidden language-component' data-component='errorAn'>Λάθος:</span>
                            <span class='language-component' data-component='choose'>Πρέπει να επιλέξετε μια απάντηση</span>
                        </p>
                        
                            ${question.options
                              .map(
                                (option, index) => `
                                <div class='govgr-radios__item'>
                                    <label class='govgr-label govgr-radios__label'>
                                        ${option}
                                        <input class='govgr-radios__input' type='radio' name='question-option' value='${option}' />
                                    </label>
                                </div>
                            `
                              )
                              .join("")}
                    </div>
                </fieldset>
            </div>
        `;
    }
    $(".question-container").html(questionElement);
  }

  function setResult(text) {
    const resultWrapper = document.getElementById("resultWrapper");
    const result = document.createElement("h5");
    result.textContent = text;
    resultWrapper.appendChild(result);
  }

  function skipToEnd(message) {
    const errorEnd = document.createElement("h5");
    const error =
      currentLanguage === "greek"
        ? "Λυπούμαστε αλλά δεν δικαιούστε προσωρινή άδεια παρκαρίσματος!"
        : "We are sorry but you are not entitled to the temporary parking permit!";
    errorEnd.className = "govgr-error-summary";
    errorEnd.textContent = error + " " + message;
    $(".question-container").html(errorEnd);
    hideFormBtns();
  }

  $("#startBtn").click(function () {
    $("#intro").html("");
    $("#languageBtn").hide();
    $("#questions-btns").show();
  });

  // ------- ΤΟ ΣΗΜΑΝΤΙΚΟ ΔΙΟΡΘΩΜΕΝΟ NEXT/LLM LOGIC ---------
  $("#nextQuestion").click(function () {
    // ΠΡΟΣΟΧΗ: λειτουργεί και για ερωτήσεις με 0 options (τελικές nodes)
    if ($(".govgr-radios__input").is(":checked") || $(".govgr-radios__input").length === 0) {
      var selectedOptionValue = $('input[name="question-option"]:checked').val();
      userAnswers[currentQuestion] = selectedOptionValue;
      sessionStorage.setItem("answer_" + currentQuestion, selectedOptionValue);

      var currentQ = all_questions[currentQuestion];
      var selectedIndex = currentQ.options ? currentQ.options.indexOf(selectedOptionValue) : null;
      var nextId = null;
      if (window._jsonFormatIsLLM && currentQ.next && currentQ.next.length && selectedIndex !== null && selectedIndex >= 0) {
        nextId = currentQ.next[selectedIndex];
      } else if (window._jsonFormatIsLLM && currentQ.next && currentQ.next.length === 1 && (selectedIndex === null || selectedIndex < 0)) {
        // χειρισμός για τελικές nodes (χωρίς options)
        nextId = currentQ.next[0];
      }

      if (window._jsonFormatIsLLM && nextId) {
        const nextQ = all_questions.find(q => q.id == nextId || q.id === nextId);
        if (nextQ && nextQ.message) {
          showResultFromLLMJson(nextQ);
          return;
        } else if (nextQ) {
          currentQuestion = all_questions.findIndex(q => q.id == nextId || q.id === nextId);
          loadQuestion(currentQuestion, true);
          return;
        }
      }

      if (currentQuestion + 1 == totalQuestions) {
        if(window._jsonFormatIsLLM){
          var finalQ = all_questions.find(q => q.id === "eligible" || q.id === "ineligible_disability" || q.id === "ineligible_income" || q.id === "not_implemented_digital" || q.id === (currentQuestion + 1));
          if (!finalQ) { finalQ = all_questions[all_questions.length - 1]; }
          showResultFromLLMJson(finalQ);
        } else {
          showResultFromOldFormat(userAnswers);
        }
      } else {
        currentQuestion++;
        loadQuestion(currentQuestion, true);
        if (currentQuestion + 1 == totalQuestions) {
          $(this).text("Submit");
        }
      }
    } else {
      loadQuestion(currentQuestion, false);
    }
  });
  // ----------------------------------------------------

  $("#backButton").click(function () {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion(currentQuestion, true);

      var answer = userAnswers[currentQuestion];
      if (answer) {
        $('input[name="question-option"][value="' + answer + '"]').prop(
          "checked",
          true
        );
      }
    }
  });

  $("#questions-btns").hide();

  getQuestions().then(() => {
    getEvidences().then(() => {
      getFaq().then(() => {
        loadFaqs();
        $("#faqContainer").show();
        loadQuestion(currentQuestion, true);
      });
    });
  });
});
