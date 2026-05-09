export interface ConditionDetails {
  name: string;
  symptoms: string[];
  whenToSeek: {
    emergency: string[];
    seeDoctor: string[];
  };
  causes: string[];
  triggers?: string[];
  riskFactors?: string[];
  complications?: string[];
  treatment: {
    primary: string[];
    emergency?: string[];
  };
  selfCare: {
    dos: string[];
    donts?: string[];
  };
  prevention?: string[];
  resources?: {
    name: string;
    website?: string;
    helpline?: string;
  }[];
  // NHS-style action cards
  do?: string[];
  dont?: string[];
  seeGPIf?: string[];
  call999If?: string[];
  // Treatment subsections
  surgery?: string[];
  chemotherapy?: string[];
  radiotherapy?: string[];
  medicine?: string[];
  medicines?: string[];
  lifestyleChanges?: string[];
  // Generic sections (for low-frequency data)
  [key: string]: any;
}

export const conditionDetailsMap: Record<string, ConditionDetails> = {
  migraine: {
    name: "Migraine",
    symptoms: [
      "Intense throbbing or pulsing pain, usually on one side of the head",
      "Sensitivity to light and sound",
      "Nausea and vomiting",
      "Visual disturbances (aura) such as flashing lights or blind spots",
      "Difficulty concentrating",
      "Dizziness or vertigo",
    ],
    whenToSeek: {
      emergency: [
        "Sudden, severe headache like a thunderclap",
        "Headache with fever, stiff neck, confusion, seizures, double vision, numbness, or difficulty speaking",
        "Headache after a head injury",
        "Chronic headache that is worse after coughing, exertion, straining, or a sudden movement",
        "New headache pain if you're older than 50",
      ],
      seeDoctor: [
        "You have three or more headaches per week",
        "You need to take pain reliever for your headaches most days",
        "Your headaches are disabling and affecting your quality of life",
        "You experience new or different headache symptoms",
      ],
    },
    causes: [
      "Changes in brain chemistry and nerve pathways",
      "Genetics - migraines often run in families",
      "Hormonal changes, especially in women",
      "Brain chemical imbalances involving serotonin",
    ],
    triggers: [
      "Hormonal changes (menstrual periods, pregnancy, menopause)",
      "Certain foods (aged cheeses, processed foods, alcohol, caffeine)",
      "Stress and anxiety",
      "Sensory stimuli (bright lights, loud sounds, strong smells)",
      "Changes in sleep patterns",
      "Physical exertion",
      "Weather changes",
      "Medications (oral contraceptives, vasodilators)",
    ],
    riskFactors: [
      "Family history of migraines",
      "Age (most common in 30s, can occur at any age)",
      "Sex (more common in women)",
      "Hormonal changes",
    ],
    treatment: {
      primary: [
        "Pain-relieving medications (taken during attacks): aspirin, ibuprofen, triptans",
        "Preventive medications (taken regularly): beta blockers, antidepressants, anti-seizure drugs, CGRP inhibitors",
        "Rest in a quiet, dark room",
        "Apply hot or cold compresses to your head or neck",
        "Small amounts of caffeine may help in early stages",
      ],
      emergency: [
        "If severe symptoms persist despite treatment",
        "If you experience neurological symptoms like vision loss or difficulty speaking",
      ],
    },
    selfCare: {
      dos: [
        "Keep a headache diary to identify your triggers",
        "Establish regular sleep patterns - go to bed and wake up at consistent times",
        "Drink plenty of water throughout the day",
        "Exercise regularly, but avoid sudden intense physical activity",
        "Manage stress through relaxation techniques, meditation, or yoga",
        "Eat regular meals and avoid skipping meals",
        "Limit caffeine and alcohol consumption",
      ],
      donts: [
        "Don't overuse pain medications - this can lead to medication-overuse headaches",
        "Don't skip meals or let yourself get too hungry",
        "Avoid known triggers when possible",
      ],
    },
    prevention: [
      "Take preventive medication as prescribed by your doctor",
      "Practice stress-reduction techniques regularly",
      "Maintain a regular sleep schedule",
      "Stay hydrated",
      "Regular exercise (but avoid sudden intense activity)",
      "Identify and avoid your personal triggers",
    ],
    resources: [
      {
        name: "American Migraine Foundation",
        website: "www.americanmigrainefoundation.org",
        helpline: "1-800-544-0404",
      },
      {
        name: "National Headache Foundation",
        website: "www.headaches.org",
      },
    ],
  },
  flu: {
    name: "Influenza (Flu)",
    symptoms: [
      "Sudden onset of fever (usually high)",
      "Chills and sweats",
      "Headache",
      "Dry, persistent cough",
      "Muscle aches and soreness (especially in back, arms, and legs)",
      "Fatigue and weakness",
      "Stuffy or runny nose",
      "Sore throat",
    ],
    whenToSeek: {
      emergency: [
        "Difficulty breathing or shortness of breath",
        "Chest pain or pressure",
        "Sudden dizziness or confusion",
        "Severe or persistent vomiting",
        "Flu symptoms that improve but then return with fever and worse cough",
        "High fever (above 103°F / 39.4°C) that doesn't respond to medication",
      ],
      seeDoctor: [
        "You're at high risk for complications (over 65, pregnant, have chronic conditions)",
        "Symptoms don't improve after a week",
        "You develop new symptoms",
        "You want to discuss antiviral medications (most effective within 48 hours of symptom onset)",
      ],
    },
    causes: [
      "Influenza viruses (types A, B, and C)",
      "Spread through respiratory droplets when infected people cough, sneeze, or talk",
      "Can also spread by touching contaminated surfaces then touching face",
    ],
    triggers: [
      "Seasonal patterns (most common in fall and winter)",
      "Close contact with infected individuals",
      "Crowded environments",
      "Weakened immune system",
    ],
    riskFactors: [
      "Age (young children and adults over 65)",
      "Living or working in crowded facilities",
      "Weakened immune system",
      "Chronic illnesses (asthma, diabetes, heart disease)",
      "Pregnancy",
      "Obesity",
    ],
    treatment: {
      primary: [
        "Rest - stay home and get plenty of sleep",
        "Drink lots of fluids (water, warm soups, tea)",
        "Over-the-counter pain relievers (acetaminophen, ibuprofen) for fever and aches",
        "Antiviral medications if prescribed within 48 hours of symptom onset",
        "Warm salt water gargle for sore throat",
        "Humidifier to ease congestion",
      ],
      emergency: [
        "Hospitalization may be needed for severe cases",
        "IV fluids and oxygen therapy",
        "Breathing support if needed",
      ],
    },
    selfCare: {
      dos: [
        "Stay home to avoid spreading the virus",
        "Cover your mouth and nose when coughing or sneezing",
        "Wash your hands frequently with soap and water",
        "Get plenty of rest - your body needs energy to fight the infection",
        "Stay hydrated with water, tea, or warm soup",
        "Use a humidifier to help with congestion",
        "Monitor your temperature regularly",
      ],
      donts: [
        "Don't give aspirin to children or teenagers (risk of Reye's syndrome)",
        "Don't go to work or school while you're contagious",
        "Avoid close contact with others, especially high-risk individuals",
      ],
    },
    prevention: [
      "Get an annual flu vaccine (recommended for everyone 6 months and older)",
      "Wash your hands frequently with soap and water",
      "Avoid touching your eyes, nose, and mouth",
      "Avoid close contact with sick people",
      "Clean and disinfect frequently touched surfaces",
      "Practice healthy habits: sleep, exercise, manage stress, eat nutritious foods",
      "Stay home when you're sick",
    ],
    resources: [
      {
        name: "CDC Flu Information",
        website: "www.cdc.gov/flu",
        helpline: "1-800-CDC-INFO",
      },
    ],
  },
  "tension-headache": {
    name: "Tension Headache",
    symptoms: [
      "Dull, aching head pain",
      "Sensation of tightness or pressure across forehead or on sides and back of head",
      "Tenderness on scalp, neck and shoulder muscles",
      "Mild to moderate pain (not severe)",
      "Both sides of the head are typically affected",
      "Not worsened by physical activity",
    ],
    whenToSeek: {
      emergency: [
        "Sudden, severe headache",
        "Headache with fever, stiff neck, confusion, vision changes, numbness, or difficulty speaking",
        "Headache after head injury",
        "Severe headache that comes on suddenly (thunderclap headache)",
      ],
      seeDoctor: [
        "Headaches disrupt your daily activities",
        "You need pain medication more than twice a week",
        "Pattern of headaches changes",
        "Headaches are getting worse",
        "You're over 50 and experiencing new headaches",
      ],
    },
    causes: [
      "Muscle contractions in the head and neck regions",
      "Often related to stress, anxiety, or poor posture",
      "Exact cause often unclear - likely combination of factors",
    ],
    triggers: [
      "Stress and anxiety",
      "Poor posture",
      "Eye strain from screens or poor lighting",
      "Fatigue and lack of sleep",
      "Dehydration",
      "Skipping meals",
      "Depression",
      "Jaw clenching or teeth grinding",
    ],
    riskFactors: [
      "Being a woman (more common in women)",
      "Middle age (most common in 40s)",
      "Stress",
      "Depression or anxiety",
    ],
    treatment: {
      primary: [
        "Over-the-counter pain relievers (aspirin, ibuprofen, acetaminophen)",
        "Rest and relaxation in a quiet, dark room",
        "Gentle massage of neck and shoulder muscles",
        "Apply heating pad or warm compress to tense muscles",
        "Cold compress on forehead",
        "For chronic cases: preventive medications (antidepressants, muscle relaxants)",
      ],
    },
    selfCare: {
      dos: [
        "Practice good posture, especially when sitting at a desk",
        "Take regular breaks from computer work (20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds)",
        "Manage stress through relaxation techniques, meditation, yoga, or deep breathing",
        "Exercise regularly to reduce tension",
        "Get adequate sleep (7-9 hours per night)",
        "Stay hydrated throughout the day",
        "Apply heat or cold to tense muscles",
        "Consider physical therapy or massage therapy",
      ],
      donts: [
        "Don't overuse pain medications (can lead to rebound headaches)",
        "Avoid poor posture and staying in one position too long",
        "Don't skip meals",
        "Avoid excessive caffeine",
      ],
    },
    prevention: [
      "Identify and manage stress triggers",
      "Maintain good posture",
      "Regular exercise and stretching",
      "Adequate sleep",
      "Stay hydrated",
      "Regular meals",
      "Ergonomic workspace setup",
      "Regular breaks from screen time",
    ],
    resources: [
      {
        name: "National Headache Foundation",
        website: "www.headaches.org",
      },
    ],
  },
  meningitis: {
    name: "Meningitis",
    symptoms: [
      "Sudden high fever",
      "Severe headache",
      "Stiff neck",
      "Nausea or vomiting",
      "Confusion or difficulty concentrating",
      "Seizures",
      "Sleepiness or difficulty waking",
      "Sensitivity to light (photophobia)",
      "Lack of appetite or thirst",
      "Skin rash (in some cases of bacterial meningitis)",
    ],
    whenToSeek: {
      emergency: [
        "ALL suspected cases of meningitis require immediate medical attention - call 911",
        "Sudden high fever with severe headache",
        "Stiff neck with fever and headache",
        "Confusion or altered consciousness",
        "Seizures",
        "Severe vomiting",
        "Difficulty staying awake",
        "Skin rash with fever",
      ],
      seeDoctor: [
        "If you've been exposed to someone with meningitis",
        "For follow-up care after treatment",
      ],
    },
    causes: [
      "Viral infections (most common type, usually less severe)",
      "Bacterial infections (serious, life-threatening, requires immediate treatment)",
      "Fungal infections (rare, usually in people with weakened immune systems)",
      "Parasitic infections (very rare)",
      "Non-infectious causes: cancer, lupus, certain medications",
    ],
    triggers: [
      "Close contact with infected person",
      "Skipping vaccinations",
      "Age (infants and young adults at higher risk)",
      "Living in crowded settings (dormitories, military barracks)",
      "Weakened immune system",
      "Travel to areas where meningitis is common",
    ],
    riskFactors: [
      "Age (infants, teenagers, young adults most at risk)",
      "Skipping vaccinations",
      "Living in community settings",
      "Pregnancy",
      "Compromised immune system",
    ],
    treatment: {
      primary: [
        "IMMEDIATE HOSPITALIZATION REQUIRED",
        "Bacterial meningitis: Intravenous antibiotics and corticosteroids",
        "Viral meningitis: Rest, fluids, over-the-counter pain medication (usually resolves on its own)",
        "Fungal meningitis: Antifungal medications",
        "Supportive care: IV fluids, oxygen, medications to reduce swelling",
      ],
      emergency: [
        "Call 911 immediately if meningitis is suspected",
        "Emergency department evaluation and treatment",
        "Intensive care may be needed for severe cases",
        "Antibiotics started before test results confirm diagnosis",
      ],
    },
    selfCare: {
      dos: [
        "Get vaccinated - vaccines prevent many types of bacterial meningitis",
        "Practice good hygiene - wash hands frequently",
        "Cover your mouth when coughing or sneezing",
        "Don't share drinks, utensils, or personal items",
        "Stay healthy with proper rest, exercise, and nutrition",
        "If exposed to someone with meningitis, contact your doctor immediately",
      ],
      donts: [
        "Don't delay seeking medical care if symptoms appear",
        "Don't share food, drinks, or eating utensils",
        "Don't kiss or have close contact with someone who has meningitis",
      ],
    },
    prevention: [
      "Vaccination (meningococcal, pneumococcal, Hib, MMR vaccines)",
      "Good hygiene practices",
      "Avoid close contact with sick individuals",
      "Don't share personal items",
      "Maintain a healthy immune system",
      "Chemoprophylaxis (preventive antibiotics) if exposed to bacterial meningitis",
    ],
    resources: [
      {
        name: "Meningitis Research Foundation",
        website: "www.meningitis.org",
        helpline: "1-800-668-1975",
      },
      {
        name: "CDC Meningitis Information",
        website: "www.cdc.gov/meningitis",
      },
    ],
  },
  sinusitis: {
    name: "Sinusitis",
    symptoms: [
      "Facial pain or pressure (especially around nose, eyes, forehead)",
      "Nasal congestion or stuffiness",
      "Thick yellow or green nasal discharge",
      "Reduced sense of smell and taste",
      "Cough (often worse at night)",
      "Headache",
      "Ear pressure or pain",
      "Fatigue",
      "Bad breath (halitosis)",
      "Tooth pain in upper jaw",
    ],
    whenToSeek: {
      emergency: [
        "Severe headache or facial pain",
        "Confusion or altered mental state",
        "Vision changes or swelling around eyes",
        "High fever (above 102°F / 38.9°C)",
        "Stiff neck",
        "Severe swelling of forehead, eyes, or face",
      ],
      seeDoctor: [
        "Symptoms last more than 10 days without improvement",
        "Fever lasting more than 3-4 days",
        "Multiple sinus infections within a year",
        "Symptoms that don't respond to over-the-counter treatments",
        "Symptoms that seem to improve then get worse",
      ],
    },
    causes: [
      "Viral infection (most common - from colds)",
      "Bacterial infection (develops sometimes after viral infection)",
      "Allergies",
      "Nasal polyps or deviated septum",
      "Fungi (rare)",
      "Blockage of sinus drainage",
    ],
    triggers: [
      "Common cold or upper respiratory infection",
      "Seasonal allergies (hay fever)",
      "Exposure to irritants (smoke, pollution, strong odors)",
      "Changes in air pressure (flying, diving)",
      "Dental infections",
      "Swimming or diving",
    ],
    riskFactors: [
      "History of allergies or asthma",
      "Nasal passage abnormality (deviated septum, polyps)",
      "Respiratory infections",
      "Immune system disorders",
      "Smoking or exposure to secondhand smoke",
      "Cystic fibrosis",
    ],
    treatment: {
      primary: [
        "Saline nasal irrigation (neti pot or spray)",
        "Nasal corticosteroid sprays",
        "Over-the-counter decongestants (short-term use only)",
        "Pain relievers (ibuprofen, acetaminophen)",
        "Warm, moist compress on face",
        "Steam inhalation",
        "Antibiotics (only if bacterial infection confirmed)",
        "For chronic cases: allergy medications or immunotherapy",
      ],
    },
    selfCare: {
      dos: [
        "Drink plenty of fluids to thin mucus",
        "Use a humidifier or breathe steam from a bowl of hot water",
        "Apply warm compresses to your face several times a day",
        "Irrigate your nasal passages with saline solution",
        "Get plenty of rest",
        "Sleep with your head elevated to help drainage",
        "Avoid air travel when possible during acute infection",
      ],
      donts: [
        "Don't use nasal decongestant sprays for more than 3 days (can cause rebound congestion)",
        "Avoid chlorinated pools if they trigger your symptoms",
        "Don't smoke and avoid secondhand smoke",
        "Don't alcohol (can worsen swelling)",
      ],
    },
    prevention: [
      "Practice good hand hygiene",
      "Avoid people who have colds or infections",
      "Manage allergies with your doctor",
      "Avoid cigarette smoke and polluted air",
      "Use a humidifier to keep air moist",
      "Stay hydrated",
    ],
    resources: [
      {
        name: "American Academy of Otolaryngology",
        website: "www.entnet.org",
      },
    ],
  },
  // Example condition showcasing all card types
  asthma: {
    name: "Asthma",
    symptoms: [
      "Shortness of breath or difficulty breathing",
      "Chest tightness or pain",
      "Wheezing (a whistling sound when breathing)",
      "Coughing, especially at night or early morning",
      "Trouble sleeping due to breathing difficulties",
    ],
    riskFactors: [
      "Family history of asthma or allergies",
      "Childhood respiratory infections",
      "Exposure to allergens (dust mites, pet dander, pollen)",
      "Exposure to occupational irritants",
      "Smoking or exposure to secondhand smoke",
      "Obesity",
    ],
    complications: [
      "Permanent narrowing of airways (airway remodeling)",
      "Frequent respiratory infections",
      "Reduced lung function over time",
      "Side effects from long-term medication use",
      "Psychological impact (anxiety, depression)",
      "Interruption of daily activities and sleep",
    ],
    whenToSeek: {
      emergency: [
        "Severe shortness of breath or wheezing",
        "No improvement after using quick-relief inhaler",
        "Difficulty speaking or walking due to breathlessness",
        "Blue tint to lips or fingernails (cyanosis)",
      ],
      seeDoctor: [
        "Symptoms occur more than twice a week",
        "You need to use quick-relief inhaler more than twice a week",
        "You wake up at night due to asthma symptoms",
        "Your symptoms interfere with daily activities",
      ],
    },
    causes: [
      "Airway inflammation and hypersensitivity",
      "Genetic predisposition",
      "Environmental factors (allergens, irritants)",
      "Respiratory infections during childhood",
    ],
    triggers: [
      "Allergens (pollen, dust mites, mold, pet dander)",
      "Air pollutants and irritants (smoke, strong odors, fumes)",
      "Respiratory infections (colds, flu)",
      "Physical activity (exercise-induced asthma)",
      "Cold air or weather changes",
      "Stress and strong emotions",
      "Certain medications (aspirin, beta blockers)",
    ],
    // NHS-style action cards
    do: [
      "Use your preventer inhaler every day as prescribed",
      "Carry your reliever inhaler with you at all times",
      "Keep a symptom diary to identify your triggers",
      "Get regular asthma reviews with your doctor or nurse",
      "Get the flu vaccine every year",
      "Follow your asthma action plan",
    ],
    dont: [
      "Don't smoke, and avoid secondhand smoke",
      "Don't ignore worsening symptoms",
      "Don't stop taking your preventer inhaler without consulting your doctor",
      "Don't overuse your reliever inhaler (more than 3 times a week suggests poor control)",
    ],
    seeGPIf: [
      "Your asthma symptoms are getting worse",
      "You're using your reliever inhaler 3 or more times a week",
      "You're waking up at night with asthma symptoms",
      "Your asthma is affecting your daily activities",
      "You need a new prescription or your treatment reviewed",
    ],
    call999If: [
      "You're struggling to breathe",
      "Your lips or fingers are turning blue",
      "You're too breathless to speak, eat or sleep",
      "Your reliever inhaler isn't helping",
      "You feel your chest is tight and it's not getting better",
    ],
    // Treatment subsections
    medicine: [
      "Reliever inhalers (blue) - Used when needed for quick relief (salbutamol, terbutaline)",
      "Preventer inhalers (brown, red, orange) - Used daily to reduce inflammation (corticosteroids)",
      "Combination inhalers - Contain both preventer and long-acting reliever",
      "Leukotriene receptor antagonists - Tablets to reduce inflammation",
      "Theophylline - Tablets to relax airway muscles",
      "Steroid tablets - For severe flare-ups",
    ],
    surgery: [
      "Bronchial thermoplasty - A procedure that uses heat to reduce smooth muscle in airways (for severe asthma)",
    ],
    lifestyleChanges: [
      "Identify and avoid your asthma triggers",
      "Maintain a healthy weight through diet and exercise",
      "Practice breathing exercises and techniques",
      "Quit smoking and avoid secondhand smoke",
      "Use air purifiers to reduce indoor allergens",
      "Keep your home clean and well-ventilated",
    ],
    treatment: {
      primary: [
        "Daily preventer medication (usually inhaled corticosteroids)",
        "Quick-relief inhaler for symptoms",
        "Allergy medications if allergies trigger your asthma",
        "Personalized asthma action plan",
      ],
    },
    selfCare: {
      dos: [
        "Monitor your symptoms and peak flow readings",
        "Take your preventer medication daily, even when feeling well",
        "Exercise regularly to improve lung function (with proper precautions)",
        "Practice good sleep hygiene",
        "Manage stress through relaxation techniques",
        "Stay up to date with vaccinations",
      ],
      donts: [
        "Don't skip doses of your preventer inhaler",
        "Don't exercise in very cold air without a face covering",
        "Avoid exposure to known triggers when possible",
      ],
    },
    prevention: [
      "Avoid known triggers and allergens",
      "Take preventer medication as prescribed",
      "Get regular exercise to strengthen lungs",
      "Maintain a healthy indoor environment",
      "Get annual flu vaccinations",
      "Follow your asthma action plan",
      "Attend regular check-ups",
    ],
    resources: [
      {
        name: "Asthma UK",
        website: "www.asthma.org.uk",
        helpline: "0300 222 5800",
      },
      {
        name: "American Lung Association",
        website: "www.lung.org",
        helpline: "1-800-LUNGUSA",
      },
    ],
  },
};