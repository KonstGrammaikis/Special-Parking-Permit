Όνομα Υπηρεσίας: Προσωρινή άδεια παρκαρίσματος λόγω ειδικών περιστάσεων

Περιγραφή της Υπηρεσίας

Αυτή η εργασία παρέχει ένα διαλογικό σύστημα με 2 flows: παραδοσιακό wizard και νέο LLM-based flow, για την ηλεκτρονική αξιολόγηση αίτησης άδειας προσωρινού παρκαρίσματος ειδικών περιπτώσεων. Ο πυρήνας βασίζεται στο μοντέλο CPSV-AP και υποστηρίζει πολυγλωσσικά flows, FAQ και δυναμικά δικαιολογητικά. Ο πολίτης ή επαγγελματίας μπορεί να αξιολογήσει ηλεκτρονικά αν δικαιούται προσωρινή άδεια στάθμευσης για ειδικές περιπτώσεις, είτε λόγω εκδήλωσης είτε λόγω αναπηρίας, εργαζόμενος ή ειδικής κοινωνικής ανάγκης, ακολουθώντας έναν δομημένο πολυγλωσσικό διάλογο.

Μοντέλο CPSV-AP

Η υπηρεσία περιγράφεται με βάση το πρότυπο CPSV-AP ως εξής:

PublicService Name: Αίτηση για έγκριση προσωρινού παρκαρίσματος ειδικών περιπτώσεων

Evidence:
Τα απαιτούμενα δικαιολογητικά παρουσιάζονται δυναμικά, ανάλογα με τις απαντήσεις του χρήστη (π.χ. απόφαση δήμου, άδεια εκδήλωσης, πιστοποίηση ΑΜΕΑ κ.λπ.).

Criterion Requirements:

Ηλεκτρονικός έλεγχος μέσω ερωτήσεων αν πληρούνται βασικά κριτήρια (κατηγορία ΑΜΕΑ, διάρκεια, ζώνη στάθμευσης).

FAQ & Multilingual: Υποστηρίζονται ελληνικά και αγγλικά, καθώς και 3 συχνές ερωτήσεις.

Διαλογικό Σύστημα

Αριθμός ερωτήσεων: 8 κύριες, όλες με επιλογές (multiple choice).

Διαφορετικά σενάρια/καταλήξεις (3-4):

•	Εκδήλωση μεγάλης διάρκειας > 1 ημέρας → επιπλέον δικαιολογητικά.
•	Αναπηρία και ράμπα → πρέπει ο αιτών να είναι στη κατηγορία ΑΜΕΑ αλλιώς δεν μπορεί να επιλέξει ράμπα βγαίνει μήνυμα που δεν το αφήνει να συνεχίσει
•	Επαγγελματικό όχημα σε κεντρική ζώνη → ειδοποίηση για περιορισμούς
•	Αν δεν είναι σε καμία ομάδα που δικαιούται να κάνει αίτηση το σύστημα τον ενημερώνει και σταματάει τη διαδικασία

Υποστηριζόμενες ροές (Flows)

1. Κλασικό Wizard**  
   - Πηγή: `question-utils/all-questions.json`
   - Απλή ροή ερωτήσεων με σταθερή σειρά και πολλαπλές επιλογές.
2. LLM-Based Flow
   - Πηγή: `question-utils/questions_llm2.json`
   - Το flow και τα branches δημιουργήθηκαν με prompt προς LLM (Perplexity).  
   - To promt που χρησιμοποίησα είναι το παρακάτω:
           "You are asked to create an eligibility wizard (step-by-step dialogue) for the following public service: Service Name: Transportation Card for Disabled
            Description: Card provided free of charge to persons with at least 67% disability, subject to specific criteria and upon submission of documents.
            Conditions/Criteria: - Applicant must be a person with at least 67% disability; - Must not exceed certain income levels; - May need additional supporting documents.
            Required documents: - Application; - ID or other identification; - medical certificate; - recent photo; - additional supporting documents depending on eligibility branch.
            Please generate a wizard-like dialogue: break down the criteria into sequential YES/NO or multiple-choice questions, include input for all critical fields, and design at least 3–4 possible dialogue endings (eligible, ineligible, needs more info, eligible                 with extra docs).Mark the user steps, questions, possible answers and, for each outcome, specify which documents the user must finally submit."

Πώς αλλάζω flow (αρχεία JSON ερωτήσεων)
- Για να τρέξει παραδοσιακό wizard flow:  
  - Άλλαξε το JS loader να διαβάζει το `all-questions.json` στο path:  
    ```
    return fetch("question-utils/all-questions.json")
    ```
- Για να τρέξει **LLM-based flow**:  
  - Άλλαξε το JS loader να διαβάζει το `questions_llm2.json` στο path:  
    ```
    return fetch("question-utils/questions_llm2.json")
    ```

Τεκμηρίωση/Φάκελοι
- Όλα τα JSON, prompts και τεκμηρίωση βρίσκονται στον φάκελο `question-utils/` και στη ρίζα του repo.
- Κώδικας wizard: `js/jquery-functions.js`

  
Οδηγίες χρήσης συστήματος

Ξεκινήστε τη διαδικασία απαντώντας σε κάθε ερώτηση του διαλόγου.

Ανάλογα με τις απαντήσεις, εμφανίζονται δυναμικά διαφορετικές καταλήξεις και τα αντίστοιχα δικαιολογητικά.

Στο τέλος, μπορείτε να συμβουλευτείτε τις Συχνές Ερωτήσεις (FAQ) για περισσότερες πληροφορίες.

Links

GitHub repository: https://github.com/KonstGrammaikis/Special-Parking-Permit

Δημοσιευμένο Online σύστημα (GitHub Pages URL): https://konstgrammaikis.github.io/Special-Parking-Permit/#

