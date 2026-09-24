/* Help centre · the content.

   Every question and answer here is the company's own help centre copy, moved
   across whole. Three things were changed on the way in, and only these:
   - no hyphens or dashes: compounds are written open ("long term", "pea sized"),
     ranges read "to", and "non" and "re" compounds are closed up;
   - no capitals typed as capitals: "HELP CENTRE" is "Help centre". Real
     acronyms (UK, EU, DNA, GDPR, GMP, IBS, SIBO, BV, HRV, PDF, QR, iOS) stay;
   - obvious typing slips are mended ("re delivered", "phenomelongeviyt",
     "sailing cap", "defected", "What is I have").
   Groups the source marks as unwritten ("To write, no content on the store
   yet", "Nothing written yet") are left out rather than shown empty.

   Shape: a topic has groups, a group has [question, answer] pairs. An answer is
   one string; a line starting "• " is a list item, a blank line starts a new
   paragraph. help.js does the rendering. */
window.PH_HELP = (function () {
  'use strict';

  var T = [];

  /* ======================================================================
     TESTS
     ==================================================================== */
  T.push({
    id: 'tests', name: 'Tests', title: 'Kits, samples and results',
    desc: 'Everything about choosing a test, taking your sample and reading your results.',
    glyph: 'tube',
    groups: [
      { name: 'Before buying a test', qs: [
        ['How do the tests work?', 'Step 1: Order your kit online and receive it at your doorstep.\nStep 2: Collect your sample using our easy to use kit.\nStep 3: Send your sample back to our lab in the prepaid package.\nStep 4: Receive your detailed results within 2 weeks.'],
        ['Can I track my sample and results?', 'Yes. Once your kit is registered, you will receive updates when your sample reaches the lab and when your report becomes available.'],
        ['Can I order multiple kits?', 'Yes. Each kit must be registered separately so every individual receives their own report.'],
        ['How long is my kit valid?', 'All kits are valid for two years from the purchase date.'],
        ['Is the test covered by insurance?', 'Phenome Longevity tests are generally not covered by insurance. We recommend consulting your provider to check possible reimbursement options.'],
        ['Do I need a doctor’s referral to order this test?', 'No, you can order the test directly from our website without a referral.'],
        ['Can I speak to an expert before purchasing a test?', 'Yes, you can speak with an expert before purchasing a test. Please contact hello@phenomelongevity.com for more details.'],
        ['Can I track my order after purchasing a test?', 'Yes, tracking details will be provided via email once your kit is shipped.'],
        ['Which test is right for me? (Newborn screening, carrier screening, lifelong health, microbiome tests, etc.)', 'We offer different tests tailored to specific needs:\n• Comprehensive Genomic Test: Comprehensive DNA analysis for health risks, wellness insights, and longevity.\n• Oral Microbiome Test: Assesses oral bacteria linked to gum health and overall well being.\n• Gut Microbiome Test: Analyzes gut bacteria to provide insights into your digestion, immunity, and overall health.'],
        ['Do you ship internationally?', 'We currently ship within the UK only.'],
        ['Can I purchase a test for someone else?', 'Yes! You can buy a test for a family member or friend. Ensure they complete the sample collection process as instructed.'],
        ['Are these tests suitable for children?', 'Some tests, such as Newborn Screening Test, are specifically designed for infants. Other tests may be suitable for children under parental guidance. Please note that we strongly recommend working with a qualified practitioner who has experience in pediatric health and test results interpretation.'],
        ['Who can take the tests?', 'Most Phenome Longevity genetic and microbiome tests are designed for adults who are eighteen or older. These tests cannot be used for anyone under eighteen.\n\nOur Newborn Test is the exception. It is specifically created for babies and can only be purchased and activated by a parent or legal guardian.'],
        ['Can pregnant or breastfeeding women take the tests?', 'Yes, our tests are safe to use during pregnancy and breastfeeding. For extra reassurance, we encourage checking with your healthcare provider before taking the test.']
      ]},
      { name: 'Preparing for a test', qs: [
        ['Do I need to stop any medications or supplements before the tests?', 'You may continue prescribed medications unless advised otherwise by your doctor.\n\nFor supplements, stop probiotics three to five days before sampling. For microbiome tests, wait four weeks after antibiotics and two weeks after antifungal treatments if possible.'],
        ['Do I need to fast before any of the tests?', 'No fasting is required. For saliva based tests, avoid eating, drinking, smoking, chewing gum or brushing your teeth for at least thirty minutes before collecting your sample.'],
        ['Should I change my diet or lifestyle before taking the tests?', 'No. Maintain your usual routine for at least two weeks before testing so your results reflect your natural baseline.'],
        ['Are there any restrictions before taking a microbiome test?', 'Yes. Avoid alcohol for two days before collecting your sample. Do not test during menstruation unless using a tampon. Wait two weeks after a colon cleanse, enema or colonoscopy. Avoid sampling while recovering from illness.'],
        ['How long should I wait after antibiotics or lifestyle changes before testing?', 'Wait at least four weeks after antibiotics, two weeks after antifungals and around two weeks after major travel or significant lifestyle changes.'],
        ['Can I take the saliva based tests if I have braces, implants or dentures?', 'Yes. Simply remove any removable appliances before collecting your saliva and avoid using adhesive on the day of sampling.'],
        ['Do I need to follow any dietary restrictions before taking a microbiome test?', 'Avoid probiotics, antibiotics, and fermented foods for at least 72 hours before testing to get an accurate microbiome profile.'],
        ['Should I stop taking probiotics or supplements before my test?', 'Yes, refrain from probiotics and dietary supplements for 3 days before sample collection.'],
        ['Are there any medications that could affect my test results?', 'Yes, certain medications, including antibiotics, antifungals, and probiotics, can alter your microbiome composition and impact test accuracy. It’s best to wait at least 3 to 4 weeks after completing a course of antibiotics before taking a microbiome test. If you are unsure, consult with a healthcare professional before testing.'],
        ['When is the best time to take my test for accurate results?', 'The best time to take your test depends on the type of test:\n• Gut Microbiome Test: Take your sample first thing in the morning before eating or drinking.\n• Oral Microbiome Test: Collect your saliva sample before brushing your teeth, eating, or drinking.\n• Vaginal Microbiome Test: Avoid collecting a sample during menstruation for the most accurate results.\n• Skin Microbiome Test: Take your sample before applying skincare products or washing your face.\n• Genetic Tests: Can be taken at any time of the day, but ensure no food or drink (except water) for 30 minutes before collection.'],
        ['Can I eat or drink before taking an oral microbiome test?', 'Avoid eating, drinking (except water), brushing, or using mouthwash for at least 1 hour before sample collection.']
      ]},
      { name: 'Taking a test', qs: [
        ['What comes in the test kit?', 'Each kit includes detailed instructions, a collection device, a preservation solution, a secure sample tube and a prepaid return envelope. Everything you need is provided.'],
        ['How do I collect a saliva sample?', 'Spit into the funnel until the saliva reaches the marked level. Add the preservation solution, close the tube with the red cap and invert it several times to mix.'],
        ['What if I struggle to produce enough saliva?', 'Relax, take your time and let saliva build up naturally.\n\nThinking about food or gently moving your tongue can help. Do not drink water or chew anything during this time.'],
        ['How do I collect a stool sample?', 'Use the provided paper stool catcher. Scoop a pea sized amount into the tube and gently shake it to mix with the solution. Avoid any contact with toilet water or surfaces.'],
        ['Do I need to refrigerate the sample?', 'No. The preservation liquid stabilises your sample at room temperature. Keep it in a cool, dry place.'],
        ['How soon should I send my sample?', 'Please send your sample within twelve hours of collection for the highest quality.'],
        ['What should I do if my sample becomes contaminated?', 'If the sample or spoon touches toilet water or any external surface, please discard the kit and request a replacement.'],
        ['What if my sample leaked or the kit was damaged?', 'Contact us and we will immediately send a replacement kit.'],
        ['How do I collect my sample for a gut or oral microbiome test?', 'Each kit includes clear instructions. Please follow the instructions in your test kit.'],
        ['How soon should I send my sample after collecting it?', 'For the most accurate results, you should send your sample as soon as possible, preferably on the same day of collection. If immediate shipping is not possible, store the sample according to the kit instructions to prevent degradation.'],
        ['How do I collect a sample for genetic testing?', 'For genetic testing, you will need to provide a saliva sample using the collection kit provided. Please follow the instructions in the kit and ensure you do not eat, drink, chew gum, or brush your teeth 30 minutes before collection for accurate results.'],
        ['How long does sample collection take?', 'It takes only 2 minutes to collect your sample.'],
        ['What if I make a mistake while collecting my sample?', 'Contact our support team for guidance; we may send a replacement kit if needed.'],
        ['Do I need special storage for my sample before sending it?', 'Most samples do not require refrigeration and should be kept at room temperature before mailing them back. Always follow the storage instructions provided in your test kit to ensure sample integrity.'],
        ['How do I properly package my sample for shipping?', 'Each kit comes with prepaid return packaging to ensure safe delivery. Simply place your sealed sample tube inside the provided biohazard bag, then insert it into the return mailer. Follow the included instructions for proper sealing and mailing.'],
        ['What happens if my sample gets lost in transit?', 'If tracking confirms a lost sample, we will send a replacement kit free of charge.']
      ]},
      { name: 'Activating your kit', qs: [
        ['Why do I need to activate my kit?', 'Activation securely links your sample to your profile so your results can be processed.'],
        ['How do I activate my kit?', 'Visit the activation portal, enter your Kit ID and complete the short questionnaire.\n\nYou can also scan the QR code inside the kit.'],
        ['What if I lose my Kit ID?', 'Contact us and we will verify your order and issue a replacement code.'],
        ['Do I activate before or after collecting my sample?', 'Activate your kit before you collect your sample. Activation links the Kit ID to your account, so a sample that arrives at the lab from an unactivated kit cannot be matched to you.'],
        ['How do I package and mail my sample?', 'Place the sealed tube into the foam insert, close the box and then place the box into the prepaid return envelope. Drop it off at any post office.'],
        ['When should I post my sample?', 'Post on Monday or Tuesday to avoid weekend delays and ensure faster arrival at the lab.'],
        ['What happens after I send my sample?', 'Your sample is processed using high quality sequencing methods. Once your report is ready, you will receive an email or app notification.'],
        ['How long does it take to receive my results?', 'Results typically take around three weeks from when the sample reaches the laboratory.'],
        ['How do I access my results?', 'You can view your report through the Phenome Longevity app or via the online portal.']
      ]},
      { name: 'After testing & your results', qs: [
        ['What do the microbiome tests measure?', 'They assess the bacteria present in your gut or mouth, examining diversity, balance and patterns that may influence overall wellbeing.'],
        ['What do the genetic tests measure?', 'They analyse DNA based traits related to areas such as nutrition, metabolism, performance and inherited carrier conditions.'],
        ['Do any of the tests diagnose medical conditions?', 'No. Our tests provide insights and trait level information but are not diagnostic tools.'],
        ['Can I share my results with my doctor, partner or coach?', 'Yes. Reports can be downloaded and shared with healthcare or wellness professionals.'],
        ['Can I get help interpreting my results?', 'Yes. Genetic counselling is available through the app for anyone who would like personalised support.'],
        ['Do I need to retest?', 'Because your DNA stays the same, repeating a genetic test is not typically required unless new scientific updates become available.\n\nMicrobiome profiles do change and may be retested every three to six months if you are monitoring progress.'],
        ['Is my data protected?', 'Yes. All samples are processed under a unique Kit ID. Personal information is stored securely and never shared without your explicit consent.'],
        ['Who can I contact if I have questions?', 'You can contact our support team at hello@phenomelongevity.com. We’re here to ensure your experience is smooth and informative.'],
        ['How long is my kit valid?', 'Each kit has an expiration date (typically two years from purchase). Please collect and return your sample before the expiry date.'],
        ['How often should I retest my genetic profile?', 'Your DNA does not change over time, so most people only need to test once. Retesting may be relevant if new analysis panels or updated scientific interpretations become available.'],
        ['Can I use the test if I am ill or recently on antibiotics?', 'It is best to wait until you have completed antibiotics and are feeling well before collecting your saliva sample.'],
        ['Can I use the test if I am pregnant, nursing, or have a medical condition?', 'The test is safe and noninvasive. However, always consult your doctor before making lifestyle changes based on your results.'],
        ['How will I receive my results?', 'Results will be delivered via the Phenome Longevity App. Upon ordering a kit, you will be required to register and download the app to access your results. You will receive an email notification informing you that your test results are ready within the app.'],
        ['Can I share my results with my doctor or specialist?', 'Yes! Your report is designed to be shared with healthcare professionals for further guidance.'],
        ['Will I get a consultation with my results?', 'If you would like to receive consultation, we offer a 30 minute consultation.'],
        ['What should I do if I don’t understand my results?', 'We offer consultations with health experts to help you interpret your results and provide personalized recommendations.'],
        ['Can I retest my microbiome or genetics later to track changes?', 'Yes! Retesting your microbiome can help you track progress and see how dietary and lifestyle changes have influenced your gut, skin, vaginal, or oral microbiome over time. Since your microbiome adapts to external factors, periodic testing is beneficial. Genetic testing, however, only needs to be done once, as your DNA remains the same throughout your life.'],
        ['What if my results indicate a potential health concern?', 'Our tests are designed to provide insights, but they are not diagnostic tools. If your results indicate a potential health concern, we strongly recommend consulting a healthcare professional for further evaluation and personalised medical advice.'],
        ['Will my results be updated if new research emerges?', 'As microbiome and genetic research advances, we continuously improve our reports. You will receive notifications if there are significant updates that could impact your test results or health recommendations. We encourage periodic retesting to incorporate the latest scientific findings into your personalised insights.']
      ]},
      { name: 'About our tests', qs: [
        ['What technology does Phenome Longevity use for genetic and microbiome testing?', 'We use Shotgun Metagenomics and Whole Genome Sequencing. For more detailed information, please refer to our “How it Works” page on our website.'],
        ['How accurate are the tests?', 'Our tests have an accuracy rate of 99%. Please note that we focus exclusively on scientifically validated outcomes.'],
        ['Do the microbiome tests analyze bacteria, fungi, and viruses?', 'Yes, our microbiome tests provide a comprehensive analysis of bacteria, and some tests may also detect fungi and viruses depending on the test type.'],
        ['What is the difference between a gut and oral microbiome test?', 'Gut Microbiome Test: Focuses on the bacteria in your digestive system that influence digestion, immunity, and metabolism.\nOral Microbiome Test: Analyzes bacteria in the mouth related to dental and gum health.'],
        ['What happens to my sample after testing?', 'Samples are processed and securely destroyed following analysis, ensuring privacy and compliance with data protection laws.']
      ]},
      { name: 'Conditions & symptoms', qs: [
        ['Can these tests help me identify food intolerances or allergies?', 'While our tests analyze gut and genetic factors related to digestion, they do not diagnose specific allergies or intolerances.'],
        ['Can microbiome testing detect IBS, SIBO, or other gut disorders?', 'Our Gut Microbiome Test identifies microbial imbalances associated with digestive issues, but it is not a diagnostic tool for medical conditions.'],
        ['How can microbiome health affect my skin, digestion, and immune system?', 'Your microbiome plays a crucial role in many aspects of your health:\n• Skin Health: A balanced skin microbiome helps prevent acne, eczema, and irritation by maintaining a healthy barrier against harmful bacteria.\n• Digestion: Your gut microbiome supports nutrient absorption, regulates digestion, and prevents bloating, constipation, or diarrhea.\n• Immune System: Your gut houses 70% of your immune system, helping fight infections, reduce inflammation, and maintain overall well being.\n\nWhen your microbiome is imbalanced, it can lead to digestive discomfort, skin issues, and weakened immunity. Testing helps identify imbalances and provides personalized recommendations to restore optimal health.'],
        ['Can vaginal microbiome testing detect infections like BV or yeast overgrowth?', 'Yes! Our Vaginal Microbiome Test identifies bacteria and yeast imbalances linked to common vaginal health concerns.'],
        ['Can oral microbiome testing help with bad breath and gut health?', 'Yes! The Oral Microbiome Test can identify bacteria linked to bad breath and oral health issues. Since oral and gut health are interconnected, an imbalance in your mouth microbiome could also indicate potential gut health concerns.'],
        ['What genetic conditions does the full genetic test screen for?', 'The Comprehensive Genomic Test screens for a range of conditions, including:\n• Hereditary health risks (e.g., cardiovascular disease, diabetes, neurodegenerative conditions)\n• Nutritional and metabolic traits\n• Fitness and recovery potential\n• Longevity and aging markers'],
        ['Can these tests help with fertility and pregnancy planning?', 'Yes! Our Carrier Screening Test can identify potential genetic risks that may impact future pregnancies. The Vaginal Microbiome Test helps assess reproductive health, and the Comprehensive Genomic Test provides insights into fertility related genetic factors.']
      ]}
    ],
    guidesLabel: 'Your specific test', guideKind: 'test guides',
    guides: []
  });

  /* ---- test guides ----------------------------------------------------- */
  var TG = T[0].guides;

  TG.push({ id: 'gut-microbiome', name: 'Gut Microbiome Test',
    desc: 'Everything about the gut microbiome kit, from eligibility to reading your report.',
    groups: [
      { name: 'Eligibility and pre test requirements', qs: [
        ['Who should take a gut microbiome test?', 'The gut microbiome test is designed for adults aged 18 and over who want to understand their digestive health and gut bacteria. We are unable to process samples from individuals under 18.'],
        ['Why is the gut microbiome test not suitable for children?', 'Children’s gut microbiomes are still developing, and to comply with GDPR and our protection policies, we only process samples from adults aged 18 and over. This ensures ethical handling of minors’ data and more reliable results.'],
        ['Can pregnant or breastfeeding women take a gut microbiome test?', 'If you are pregnant or breastfeeding, we recommend consulting your doctor before using the gut microbiome test. Your wellbeing and your baby’s safety should always come first.'],
        ['Do I need to stop probiotics before taking a gut microbiome test?', 'Yes. Please stop taking probiotics at least four days before collecting your sample. This helps ensure your results reflect your natural gut microbiome.'],
        ['Should I stop medication before a gut microbiome test?', 'No. You should continue taking any prescribed medications and essential supplements unless your doctor advises otherwise. If you are unsure, you can contact our support team for guidance.'],
        ['Do I need to fast before a gut microbiome test?', 'No fasting is required. You should continue eating normally and maintain your usual diet for at least two weeks before collecting your sample.'],
        ['Should I keep my normal diet and lifestyle before testing?', 'Yes. To get an accurate picture of your gut microbiome, keep your diet, exercise routine, and daily habits as consistent as possible for at least two weeks before testing.'],
        ['Are there any restrictions before collecting a stool sample?', 'Yes. To ensure accurate results:\n• Wait four weeks after completing antibiotics\n• Avoid alcohol for two days before sampling\n• Do not collect a sample during active illness\n• Avoid contamination with water or toilet cleaning products'],
        ['How long should I wait after antibiotics before taking a gut microbiome test?', 'You should wait at least four weeks after finishing antibiotics or antimicrobial supplements to allow your gut microbiome to stabilise.'],
        ['Can I take a gut microbiome test during my period?', 'It is best to wait three days after your period ends. If you must collect a sample during menstruation, use a tampon and clean the area carefully to avoid contamination.'],
        ['Is it okay if the stool sample contains visible blood?', 'No. If you notice visible blood in your stool, wait until it has resolved and consult your doctor before taking the test.'],
        ['Can I take a gut microbiome test while using NSAIDs or other medications?', 'Yes, you can. If you are concerned about how a medication may affect your results, speak with your doctor or contact our support team.'],
        ['Should I wait after a colonoscopy, colon cleanse, or enema before testing?', 'Yes. Please wait at least two weeks after a colonoscopy, colon cleanse, or enema before collecting your sample to allow your gut microbiome to recover.'],
        ['How long should I wait after travel or major lifestyle changes before testing?', 'Wait approximately two weeks after travel or significant lifestyle changes so your gut microbiome reflects your normal routine.']
      ]},
      { name: 'Kit contents and sample preparation', qs: [
        ['What is included in the gut microbiome test kit?', 'Your kit includes:\n• An instruction leaflet\n• A collection tube with stabilising liquid\n• A paper stool catcher\n• Gloves and a cleaning wipe\n• A prepaid return envelope\n\nIf anything is missing or damaged, please contact us immediately.'],
        ['When is the best time to take a gut microbiome test?', 'Testing is useful if you are experiencing digestive symptoms such as bloating, gas, irregular bowel habits, or low energy. It’s also valuable for monitoring how diet or lifestyle changes affect your gut health.'],
        ['When should I avoid collecting a stool sample?', 'Avoid collecting a sample if:\n• You are recovering from illness\n• You are currently taking antibiotics\n• You have not returned to your usual routine\n\nWait until you feel well and stable before testing.'],
        ['What foods or drinks should I avoid before collecting a gut microbiome sample?', 'Avoid alcohol for two days before collecting your sample. Otherwise eat and drink normally.'],
        ['Should I stop supplements before taking a gut microbiome test?', 'Stop probiotics four days before sampling. You may continue other supplements unless advised otherwise by your doctor.']
      ]},
      { name: 'Activation and registration', qs: [
        ['How do I activate or register my gut microbiome test kit?', 'Download our app “Phenome Longevity”. If you are new, select “Sign Up” and register with your email. Then, enter your Kit ID and personal details to link the test to your account. Alternatively, visit phenomeportal.org/activate. If you are new, select “I’m New to Phenome Longevity” to create an account. Enter your Kit ID and personal details to link the test to your account.'],
        ['I lost my Kit ID. What should I do?', 'Contact us with your order details and we will verify your purchase and provide assistance with activation.'],
        ['Why do I need to complete a questionnaire?', 'The questionnaire helps personalise your results by taking into account your diet, lifestyle, and health background. Your answers guide how we interpret your data and tailor recommendations.'],
        ['What should I do if I have trouble registering my kit?', 'If you experience any issues, contact us at hello@phenomelongevity.com or use our live chat. We’ll be happy to help.']
      ]},
      { name: 'Sample collection and sending', qs: [
        ['How do I collect a stool sample for a gut microbiome test?', 'Place the paper stool catcher across the toilet so your bowel movement lands on it. Keep the collection tube upright and twist off the cap. Use the spoon attached to the cap to collect a pea sized amount of stool and place it into the tube. Close the tube tightly and shake it gently at least five times. Flush the paper catcher after use. Avoid letting the stool or spoon touch toilet water or the toilet rim.'],
        ['How much stool do I need to collect?', 'Only a pea sized amount of stool is required. Do not overfill the tube.'],
        ['What is the best time of the day to collect a stool sample?', 'You can collect your sample whenever you have a comfortable bowel movement. Many people choose their morning bowel movement, but any time of day is fine.'],
        ['Do I need to refrigerate my stool sample?', 'No refrigeration is required. Keep the sealed tube in a cool, dry place and post it within twelve hours after collection.'],
        ['How soon do I need to post my gut microbiome sample?', 'Your sample should be mailed within twelve hours of collection.'],
        ['On which days should I collect and send my sample?', 'We recommend collecting and posting your sample on Monday or Tuesday so it reaches the laboratory quickly. Avoid posting later in the week where possible.'],
        ['Why should I avoid posting my sample later in the week?', 'Samples mailed on Thursday, Friday, or Saturday may be delayed over the weekend. Sending early in the week ensures your sample reaches the lab quickly.'],
        ['What should I do if my sample touches toilet water or another surface?', 'If the stool or spoon touches toilet water or any surface other than the paper catcher, dispose of the kit and request a replacement. If it touches only the paper catcher, you may proceed.'],
        ['Can I use an ice pack or different packaging when sending my sample?', 'No. Please use only the packaging provided in your kit. An ice pack is not required, as the stabilising liquid keeps the sample stable at room temperature.']
      ]},
      { name: 'Results and reporting', qs: [
        ['How long does it take to receive gut microbiome test results?', 'Once your sample arrives at the laboratory, it typically takes around three weeks to generate your report. You’ll be notified by email when your results are ready.'],
        ['Can I track my gut microbiome sample?', 'Yes. You’ll receive updates when your sample is received by the lab and when your results are available.'],
        ['What does a gut microbiome test measure?', 'The test analyses the bacteria present in your gut and their relative abundance. This provides insight into microbial diversity, balance, and potential areas for improvement.'],
        ['Does the gut microbiome test analyse viruses or fungi?', 'No. The test focuses exclusively on bacterial DNA and does not analyse viruses or fungi.'],
        ['How accurate is a gut microbiome test?', 'We use high quality sequencing methods. When the sample is collected and sent correctly, the results reliably reflect your current gut microbiome at the time of testing.'],
        ['What information is included in the gut microbiome test report?', 'Your report includes an Overall Gut Score, detailed scores for diversity and balance, visual indicators, and personalised suggestions to support gut health.'],
        ['How do I view my gut microbiome test results?', 'Results are available through the Phenome Longevity app and on our website, where you can explore your data in a clear, easy to use format.'],
        ['Can I share my gut microbiome test results with a healthcare professional?', 'Yes. You can download your report and share it with any healthcare professional of your choice.']
      ]},
      { name: 'Troubleshooting and support', qs: [
        ['What should I do if my gut test kit didn’t arrive or is missing parts?', 'Contact us as soon as possible. We’ll send missing components or a replacement kit promptly.'],
        ['What should I do if my sample leaked or spilled?', 'Do not mail the sample. Dispose of the kit safely and contact us to receive a replacement.'],
        ['I forgot to send my sample. Can I still use it?', 'If more than twelve hours have passed since collection, please request a new kit and collect a fresh sample.'],
        ['My sample was delayed in the post. Will it still be valid?', 'The preservation solution stabilises DNA for transport. However, mailing early in the week is recommended. If you are concerned about delays, contact our support team.'],
        ['Is my genetic data secure?', 'Yes. We follow strict data protection standards and use secure systems to store and process your information. Your genetic data is never shared without your consent.']
      ]},
      { name: 'Retesting and frequency', qs: [
        ['How long is my gut microbiome test kit valid?', 'Your kit is valid for two years. The expiry date is printed on the packaging.'],
        ['How soon do I need to use my gut microbiome test kit after receiving it?', 'You can use your kit at any time within its two year validity period.'],
        ['How often should I retest my gut microbiome?', 'If you’re making significant diet or lifestyle changes, retesting after three months can help track progress. For general monitoring, testing once or twice a year is usually sufficient.']
      ]},
      { name: 'Ordering and logistics', qs: [
        ['Can I order a gut microbiome test without a healthcare practitioner?', 'Yes. You can order directly from phenomelongevity.com without a referral.'],
        ['Do you offer consultations after receiving results?', 'Yes. You can book a consultation with one of our experts to discuss your results and next steps.'],
        ['Do you ship gut microbiome test kits internationally?', 'We ship within the UK and to selected international destinations. UK kits include prepaid return postage. International return postage may vary.'],
        ['Can I order multiple gut microbiome test kits for my family?', 'Yes. Each person will need their own kit, and each kit must be registered separately to receive individual results.']
      ]},
      { name: 'Additional questions', qs: [
        ['Can I provide a liquid stool sample?', 'Yes. The stabilising liquid preserves both solid and liquid stool samples. Very watery samples may slightly affect accuracy but are still acceptable.'],
        ['Do you analyse human DNA in the gut microbiome test?', 'No. The test analyses bacterial DNA only and does not examine human genetic information.']
      ]}
    ]
  });

  TG.push({ id: 'oral-microbiome', name: 'Oral Microbiome Test',
    desc: 'Everything about the oral microbiome kit, from eligibility to reading your report.',
    groups: [
      { name: 'Eligibility and pre test requirements', qs: [
        ['Who should take an oral microbiome test?', 'The oral microbiome test is designed for adults aged 18 and over who want to understand the bacteria in their mouth and support long term oral health. We can’t process samples from individuals under 18.'],
        ['Why is the oral microbiome test not suitable for children?', 'Children’s oral microbiomes are still developing. To comply with GDPR and our data protection policies, we only process samples from adults aged 18 and over, ensuring ethical handling of minors’ data.'],
        ['Can pregnant or breastfeeding women take an oral microbiome test?', 'If you are pregnant or breastfeeding, we recommend checking with your doctor before using the oral microbiome test. Your wellbeing and your baby’s safety are our top priorities.'],
        ['Do I need to stop probiotics before taking an oral microbiome test?', 'Yes. Please stop oral probiotics, probiotic lozenges, and probiotic mouth sprays at least three to five days before collecting your saliva sample. This helps ensure your results reflect your natural oral microbiome.'],
        ['Should I stop taking medication before an oral microbiome test?', 'You should continue prescribed medications unless your doctor advises otherwise. If you are unsure about a specific medication, consult your healthcare professional or contact our support team.'],
        ['Should I avoid throat sprays or nasal decongestants before testing?', 'Yes. Avoid nonessential over the counter throat sprays and nasal decongestants unless prescribed by a doctor. This helps keep your saliva sample as natural as possible.'],
        ['Can I take an oral microbiome test if I have braces, dentures, or implants?', 'Yes. Braces, implants, and retainers are fine. If you wear dentures or removable appliances, remove them before collecting your saliva sample and skip adhesive on the day of collection.'],
        ['Do I need to fast or change my diet before an oral microbiome test?', 'No fasting or dietary changes are needed. Continue your normal diet for at least two weeks before testing so we can assess your everyday oral microbiome.'],
        ['What if my mouth is bleeding or I have a sore?', 'If you have active bleeding in your mouth, wait until it has healed before collecting your saliva sample.'],
        ['Are there any restrictions before collecting my saliva sample?', 'Yes. To ensure accurate results:\n• Avoid eating, drinking, smoking, vaping, chewing gum, or brushing your teeth for 30 minutes before collection.\n• Avoid antimicrobial mouthwash and oral sexual activity for 24 hours beforehand.\n• Do not apply denture adhesive on the day of collection.\n• Avoid dental cleanings or dental procedures for three days before sampling.'],
        ['How long should I wait after antibiotics or antifungal treatments before testing?', 'If you have taken antibiotics or antifungal medication, wait two weeks after completing your course. For botanical antimicrobials or antifungals, wait at least seven days.'],
        ['Should I keep my normal lifestyle and oral care routine before testing?', 'Yes. Stick to your usual routine as closely as possible, aside from the temporary restrictions listed above, so we capture a true picture of your typical oral microbiome.']
      ]},
      { name: 'Kit contents and activation', qs: [
        ['What’s included in the oral microbiome test kit?', 'Your kit includes:\n• An instruction booklet\n• A saliva collection funnel with attached tube\n• A tube of preservative solution\n• An extra red cap\n• A prepaid return envelope\n\nIf anything is missing or damaged, contact us and we’ll send a replacement promptly.'],
        ['Do I need to register my oral microbiome test kit before collecting my sample?', 'Yes. Registration links your sample to your account so we can deliver your kit results securely. Your Kit ID starts with “OH” and can be found inside the kit.'],
        ['How do I activate or register my oral microbiome test kit?', 'Download our app “Phenome Longevity”. If you are new, select “Sign Up” and register with your email. Then, enter your Kit ID and personal details to link the test to your account. Alternatively, visit phenomeportal.org/activate. If you are new, select “I’m New to Phenome Longevity” to create an account. Enter your Kit ID and personal details to link the test to your account.'],
        ['What information do I need during registration?', 'You’ll provide basic information such as your name and email address to link your sample to your account and receive updates.'],
        ['Do I need a smartphone to activate my kit?', 'No. You can register on any device with internet access. A smartphone is optional for scanning the QR code included in the kit.'],
        ['What should I do after registering my kit?', 'Once registered, follow the saliva collection instructions. Collect your sample only after activation to ensure proper processing.']
      ]},
      { name: 'Sample collection and sending', qs: [
        ['How do I collect a saliva sample for an oral microbiome test?', '• Set up the collection tube and funnel on a clean surface.\n• Gently spit into the funnel until the saliva reaches the 2ml mark.\n• Avoid bubbles, food particles, or mucus.\n• Pour the preservative solution into the funnel.\n• Remove and discard the funnel.\n• Seal the tube with the red cap.\n• Invert the tube ten times to mix.\n• Take your time, there’s no rush.'],
        ['What if I have trouble producing enough saliva?', 'Relax and allow saliva to pool naturally. Thinking about food or gently moving your tongue can help. Do not chew or suck on anything.'],
        ['Do I need to refrigerate my saliva sample?', 'No refrigeration is required. Keep the sealed tube in a cool, dry place until mailing.'],
        ['How do I package and mail my oral microbiome sample?', 'Place the tube in the foam insert, close the box, and place it in the prepaid envelope. Post it at any post office, ideally on Monday or Tuesday.'],
        ['What happens after I mail my saliva sample?', 'Once your sample reaches the lab, we analyse the bacterial DNA using shotgun metagenomics sequencing. You’ll receive an email or app notification when your report is ready.']
      ]},
      { name: 'Results and reporting', qs: [
        ['How long does it take to receive oral microbiome test results?', 'Results are usually ready within three weeks after the lab receives your sample.'],
        ['Can I track my oral microbiome sample and results?', 'Yes. You’ll receive updates when your sample arrives at the lab and when your report is available.'],
        ['What does an oral microbiome test measure?', 'The test measures the types and relative amounts of bacteria in your mouth using shotgun metagenomics sequencing, providing a detailed view of your oral microbiome.'],
        ['How accurate is the oral microbiome test?', 'Because we use advanced sequencing and strict laboratory protocols, your results provide a reliable snapshot of your current oral microbiome.'],
        ['Does the oral microbiome test detect viruses or fungi?', 'No. This test focuses on bacterial DNA only and does not detect viruses, yeasts, or fungi.'],
        ['What information is included in the oral microbiome test report?', 'Your report includes an Oral Health Score, insights into gum health, tooth decay risk, and bad breath potential, identification of beneficial and potentially harmful bacteria, colour coded charts for clarity, and personalised recommendations for diet, oral care, and lifestyle.'],
        ['Can an oral microbiome test diagnose cavities or gum disease?', 'No. The test does not diagnose dental conditions or replace professional dental examinations. It complements regular dental care.'],
        ['Can the oral microbiome test help me choose probiotics or mouthwash?', 'Yes. Your results can help guide choices around oral probiotics and oral care products. Our experts or your dentist can help interpret these recommendations.'],
        ['Can an oral microbiome test provide insight into overall health?', 'A healthy oral microbiome supports overall wellbeing. While this test focuses on oral bacteria, it can be a valuable step toward better general health awareness.'],
        ['Do I still need to see my dentist after taking this test?', 'Yes. Regular dental checkups and professional cleanings remain essential.']
      ]},
      { name: 'Troubleshooting and support', qs: [
        ['What should I do if my oral microbiome test kit didn’t arrive or is missing items?', 'Contact us immediately and we’ll send replacements or a new kit at no extra cost.'],
        ['I lost my Kit ID or had trouble registering. What should I do?', 'Reach out via email or live chat and we’ll verify your order and issue a replacement Kit ID if needed.'],
        ['What should I do if my saliva sample leaked or spilled?', 'Do not mail the sample. Dispose of the kit and contact us to receive a replacement.'],
        ['What should I do if I accidentally swallowed the preservative solution?', 'The preservative is designed to be safe in very small amounts, but it’s not intended for ingestion. Rinse your mouth with water and seek medical advice if you feel unwell.']
      ]},
      { name: 'Retesting and frequency', qs: [
        ['How long is the oral microbiome test kit valid?', 'Your kit is valid for two years from purchase date. The expiry date is printed on the box.'],
        ['How often should I retest my oral microbiome?', 'If you’re changing your diet or oral care routine, retesting after three months can show how your microbiome responds. For general monitoring, testing once or twice a year is usually sufficient.']
      ]},
      { name: 'Ordering and logistics', qs: [
        ['Can I order an oral microbiome test without a referral?', 'Yes. You can order it directly from phenomelongevity.com without a referral.'],
        ['Do you ship oral microbiome test kits internationally?', 'We ship within the UK and to selected countries. UK orders include prepaid return postage. International return options may vary.'],
        ['Can I order multiple oral microbiome test kits for my family?', 'Yes. Each person will need their own kit, and each kit must be registered separately to receive individual results.'],
        ['Do you offer consultations after receiving oral microbiome test results?', 'Yes. You can book a consultation with one of our experts to review your report and discuss next steps.']
      ]},
      { name: 'General questions', qs: [
        ['What is the oral microbiome and why is it important?', 'The oral microbiome is the community of bacteria living in your mouth. A balanced oral microbiome supports healthy teeth and gums and may influence overall wellbeing.'],
        ['When is it useful to test your oral microbiome?', 'Testing can be helpful if you experience gum issues, tooth decay, bad breath, or if you want deeper insight into your oral health and how lifestyle changes affect it.'],
        ['What should I do if my question isn’t answered here?', 'Our support team is always happy to help. Contact us via email or live chat for personalised assistance.']
      ]}
    ]
  });

  TG.push({ id: 'comprehensive-genomic', name: 'Comprehensive Genomic Test',
    desc: 'Whole genome sequencing, who it is for, how to take it and what you get back.',
    groups: [
      { name: 'Eligibility and pre test requirements', qs: [
        ['Who should take a comprehensive genomic test?', 'The comprehensive genomic test is designed for adults aged 18 and over who want to gain insights into their genetic profile. We cannot process samples from individuals under 18.'],
        ['Do I need to fast before providing a saliva sample for the comprehensive genomic test?', 'No fasting is required. However, you must avoid eating, drinking (including water), smoking, vaping, chewing gum, or brushing your teeth for at least 30 minutes before collecting your saliva sample.'],
        ['Can I drink water before collecting my saliva sample?', 'Please avoid water and all beverages for 30 minutes before collection. This helps ensure a clean, uncontaminated sample.'],
        ['Can I smoke, vape, or chew gum before collecting my saliva?', 'No. Avoid smoking, vaping and chewing gum for at least 30 minutes before collection to maintain sample quality.'],
        ['Should I rinse my mouth before collecting my saliva sample?', 'Yes. About 30 minutes before collection, rinse your mouth with drinking water. After rinsing, avoid mouthwash, toothpaste, food, and drinks until you collect your sample.'],
        ['When should I activate my comprehensive genomic test kit?', 'You must activate your kit before collecting your saliva sample. Each kit has a unique ID beginning with CG followed by six digits. Activate it at phenomeportal.org/activate or via our app so your sample can be linked to your account.'],
        ['Should I avoid throat sprays or nasal decongestants before testing?', 'Yes. Avoid nonessential over the counter throat sprays and nasal decongestants unless prescribed by a doctor.'],
        ['What should I check before collecting my saliva sample?', 'Before starting, confirm your kit includes:\n• Collection funnel and tube\n• Preservation solution\n• Extra red cap\n• Prepaid return envelope\n• Instruction leaflet\n\nIf anything is missing or damaged, contact us before collecting your sample.'],
        ['Should I wait after antibiotics before collecting my saliva sample?', 'Antibiotics do not change your DNA. However, for optimal saliva sample quality, wait at least 7 days after finishing antibiotics if possible.'],
        ['Are there other medicines I should stop before collecting my saliva?', 'If possible and with your doctor’s approval, try to pause nonessential anti inflammatory medicines and probiotics about one week before sample collection. Always follow medical guidance when stopping or changing medication.'],
        ['What if I have a mouth injury or bleeding gums?', 'If you have active bleeding in your mouth, wait until it has healed before collecting your saliva sample.'],
        ['Can I take the test if I have braces, dentures, or dental implants?', 'Yes. Remove removable dental appliances before collecting your saliva sample. Avoid denture adhesive on the day of collection.'],
        ['Should I maintain my normal routine before testing?', 'Yes. Your DNA remains stable, so no changes to diet or lifestyle are required before testing (aside from the 30 minute pre collection restrictions).']
      ]},
      { name: 'Kit contents and activation', qs: [
        ['What is included in the comprehensive genomic test kit?', 'Your kit includes:\n• Instruction leaflet\n• Collection funnel attached to a tube\n• Saliva preservation solution\n• Extra red sealing cap\n• Prepaid return envelope'],
        ['How do I make sure my genomic test kit is complete?', 'Before starting, check that all components are present and undamaged. If anything is missing, contact us for a replacement before collecting your sample.'],
        ['Why must I register my kit before sending my sample?', 'Each kit has a unique CG Kit ID. Registration links your saliva sample to your profile so results can be processed securely and delivered accurately.'],
        ['How do I activate or register my comprehensive genomic kit?', 'Download our app “Phenome Longevity”. If you are new, select “Sign Up” and register with your email. Then, enter your Kit ID and personal details to link the test to your account. Alternatively, visit phenomeportal.org/activate. If you are new, select “I’m New to Phenome Longevity” to create an account. Enter your Kit ID and personal details to link the test to your account.'],
        ['Do I need to stop medications or supplements before the comprehensive genomic test?', 'If possible and approved by your doctor, pause nonessential anti inflammatory medicines and probiotics about one week before collection. Continue prescribed medications unless advised otherwise.'],
        ['Can I take the test if I’m on long term medication?', 'Yes. Long term medications such as antihistamines or immunosuppressants are generally acceptable. Record them during registration and consult your doctor if concerned.'],
        ['How long should I wait after antibiotics before taking the comprehensive genomic test?', 'To ensure optimal sample stability:\n• Wait four weeks after completing antibiotics\n• Wait two weeks after antifungal medication\n• Wait seven days after botanical antimicrobials']
      ]},
      { name: 'Sample collection and sending', qs: [
        ['How do I collect a saliva sample for the comprehensive genomic test?', '• Set up the funnel and tube on a clean surface.\n• Spit gently until saliva reaches the 2ml mark.\n• Avoid bubbles and food particles.\n• Add the preservation solution.\n• Remove and discard the funnel.\n• Seal the tube with the red cap.\n• Invert the tube 10 times to mix.'],
        ['What if I can’t produce enough saliva?', 'Relax and allow saliva to build naturally. Thinking about food or gently moving your tongue may help. Do not chew anything or drink water during collection.'],
        ['Do I need to refrigerate my saliva sample?', 'No refrigeration is needed. Store the sealed tube in a cool, dry place away from direct sunlight or heat until mailing.'],
        ['How do I package and return my genomic test sample?', 'Place the sealed tube in the foam insert, close the box, and place it in the prepaid envelope. Drop it off at any post office.'],
        ['When should I post my saliva sample?', 'Post your sample on Monday or Tuesday where possible to avoid weekend delays. Avoid posting on Thursday, Friday, or Saturday.'],
        ['Do I need to send my sample immediately after collection?', 'Yes. Send your sample as soon as possible after mixing it with the preservative. Prompt mailing helps maintain DNA quality.'],
        ['Do I have to pay for return postage?', 'No. The kit includes prepaid return postage.'],
        ['How will I know when my sample has been received?', 'You’ll receive updates by email or via the Phenome Longevity app when your sample arrives at the lab and when your results are ready.'],
        ['What happens after I send my saliva sample?', 'Our laboratory team analyses your sample using advanced sequencing methods. Once complete, you can access your personalised report in the Phenome Longevity app. Optional genetic counselling may be available for additional support.']
      ]},
      { name: 'Results and reporting', qs: [
        ['How long does it take to receive comprehensive genomic test results?', 'Results are typically ready within about three weeks after the lab receives your sample.'],
        ['What does the comprehensive genomic test analyse?', 'The test analyses your DNA to provide insights into genetic traits, health predispositions, metabolism, nutrient response, and other inherited characteristics. It evaluates specific genetic markers using advanced sequencing technologies.'],
        ['Does the comprehensive genomic test analyse my entire genome?', 'The test analyses targeted genetic markers relevant to health, performance, and biological insights. It does not sequence your entire genome unless explicitly stated in your product specification.'],
        ['How accurate is the comprehensive genomic test?', 'We use validated laboratory protocols and advanced sequencing methods to ensure high analytical accuracy. When collected and returned correctly, your saliva sample provides a reliable representation of your genetic profile.'],
        ['Can the comprehensive test diagnose medical conditions?', 'No. This test does not diagnose diseases or replace medical care. It provides genetic insights and risk indicators, which should be discussed with a healthcare professional if you have concerns.'],
        ['What will my genomic report include?', 'Your report may include:\n• Genetic trait analysis\n• Health predisposition insights\n• Nutrient metabolism markers\n• Lifestyle and wellness recommendations\n• Clear visual breakdowns and personalised explanations\n\nReports are designed to be understandable while still scientifically robust.'],
        ['How do I access my results?', 'Your results will be available in the Phenome Longevity app and through your secure online account.'],
        ['Can I download or share my genomic results?', 'Yes. You can download your report and share it with a healthcare provider, nutritionist, or genetic counsellor.'],
        ['Do you offer genetic counselling?', 'Yes. Optional genetic counselling may be available if you would like support interpreting your results and understanding next steps.'],
        ['Is my genetic information secure?', 'Yes. We use secure systems and strict data protection protocols. Your genetic data is never shared without your consent.']
      ]},
      { name: 'Troubleshooting and support', qs: [
        ['My kit hasn’t arrived or is missing items. What should I do?', 'Please contact our support team immediately. We will send replacement components or a new kit at no additional cost.'],
        ['I lost my Kit ID or registration code. What should I do?', 'Get in touch with us using your order details, and we’ll issue a new Kit ID after verifying your purchase.'],
        ['What if my saliva sample leaked or spilled?', 'Do not send the sample. Dispose of the kit and contact us for a replacement.'],
        ['What if I accidentally swallowed the preservative solution?', 'The preservative is safe in very small amounts but is not intended for ingestion. Rinse your mouth with water and seek medical advice if you feel unwell.'],
        ['My sample was delayed in the post. Will it still be valid?', 'The preservation solution stabilises DNA during transport. If you are concerned about delays, contact our support team for guidance.']
      ]},
      { name: 'Retesting and frequency', qs: [
        ['Do I need to retake a comprehensive genomic test?', 'Your DNA does not change over time, so you typically only need to take this test once.'],
        ['When would I need to repeat this genomic test?', 'Retesting may only be necessary if:\n• Your sample was insufficient\n• Your kit expired\n• New testing panels or expanded features become available'],
        ['How long is the comprehensive genomic test kit valid?', 'Your test kit is valid for two years from purchase. The expiration date is printed on the packaging.']
      ]},
      { name: 'Ordering and logistics', qs: [
        ['Can I order the comprehensive genomic test without a referral?', 'Yes. You can order directly from phenomelongevity.com without needing a healthcare referral.'],
        ['Do you ship genomic test kits internationally?', 'We ship within the UK and to selected countries. UK orders include prepaid return postage. International return options may vary.'],
        ['Can I order multiple genomic test kits for family members?', 'Yes. Each person must use and register their own kit to receive an individualised report.']
      ]},
      { name: 'General questions', qs: [
        ['What is a comprehensive genomic test?', 'A comprehensive genomic test analyses specific regions of your DNA to provide insights into inherited traits, health predispositions, metabolism, and lifestyle factors.'],
        ['How is a genomic test different from a microbiome test?', 'A genomic test analyses your DNA, which remains constant throughout your life. A microbiome test analyses bacterial DNA, which changes based on diet, environment, and lifestyle.'],
        ['Is the comprehensive genomic test painful?', 'No. The test requires only a simple saliva sample and is completely noninvasive.'],
        ['Can I use the genomic test if I have a family history of disease?', 'Yes. The test may provide insight into genetic predispositions, but it does not replace clinical genetic screening or medical diagnosis.'],
        ['What should I do if my question is not answered here?', 'Please contact our support team via email or live chat. We are happy to assist with any additional questions.']
      ]}
    ]
  });

  TG.push({ id: 'sports-performance', name: 'Sports Performance Test',
    desc: 'Training, recovery and nutrition genetics, how the test works end to end.',
    groups: [
      { name: 'Eligibility and pre test requirements', qs: [
        ['Who can take the Sports Performance DNA Test?', 'The Sports Performance Test is designed for adults aged 18 years and older. We cannot process samples from individuals under 18.'],
        ['Can athletes under 18 take the Sports Performance Test?', 'No. Due to data protection regulations and ethical guidelines, we only process samples from individuals aged 18 and above.'],
        ['Do I need to fast before providing my saliva sample?', 'No fasting is required. However, you must avoid eating, drinking (including water), smoking, vaping, chewing gum, or brushing your teeth for at least 30 minutes before collecting your saliva sample.'],
        ['Should I stop supplements or performance enhancers before testing?', 'No. Since this is a DNA based test, your results are not affected by supplements. However, avoid eating or drinking within 30 minutes before sample collection.'],
        ['Do I need to stop taking medication before taking the Sports Performance Test?', 'No. Your DNA does not change based on medication use. Continue prescribed medications unless advised otherwise by your doctor.'],
        ['Can I take the test if I have braces, retainers, or dental implants?', 'Yes. If you wear removable dental appliances, remove them before collecting your saliva sample. Avoid denture adhesive on the day of collection.'],
        ['Should I wait after antibiotics before taking the Sports Performance Test?', 'Antibiotics do not affect your DNA. However, for best sample quality, wait at least 7 days after finishing antibiotics before collecting saliva.'],
        ['Can I collect a saliva sample if my mouth is bleeding or injured?', 'If you have a cut, sore, or bleeding in your mouth, wait until it has healed before collecting your sample. Blood can affect DNA quality and may cause discomfort.'],
        ['Should I maintain my normal training routine before testing?', 'Yes. Your genetic profile does not change based on short term training. No lifestyle modifications are required before testing.']
      ]},
      { name: 'Kit contents and activation', qs: [
        ['What is included in the Sports Performance Test kit?', 'Your kit includes:\n• Instruction leaflet\n• Saliva collection funnel and tube\n• DNA preservation solution\n• Extra red sealing cap\n• Prepaid return envelope'],
        ['Do I need to activate my Sports Performance Test kit before collecting my sample?', 'Yes. You must register your kit before collecting your saliva sample to link it to your account.'],
        ['How do I activate or register my Sports Performance Test kit?', 'Download our app “Phenome Longevity”. If you are new, select “Sign Up” and register with your email. Then, enter your Kit ID and personal details to link the test to your account. Alternatively, visit phenomeportal.org/activate. If you are new, select “I’m New to Phenome Longevity” to create an account. Enter your Kit ID and personal details to link the test to your account.'],
        ['Why is registration required before sending my sample?', 'Registration links your DNA sample to your secure profile so your results can be processed accurately and delivered safely.'],
        ['What information do I provide during registration?', 'You’ll provide basic information such as name and email address so we can notify you when your results are ready.']
      ]},
      { name: 'Sample collection and sending', qs: [
        ['How do I collect my saliva sample for the Sports Performance Test?', '• Rinse your mouth with water 30 minutes before collection\n• Avoid food, drink, smoking, vaping, or brushing teeth during that 30 minute period\n• Spit into the funnel until saliva reaches the 3 ml mark\n• Add the preservation solution\n• Remove the funnel\n• Seal with the red cap\n• Invert the tube 10 times to mix'],
        ['What if I can’t produce enough saliva?', 'Relax and allow saliva to build naturally. Thinking about food or gently moving your tongue can help stimulate saliva flow.'],
        ['Do I need to refrigerate my DNA sample?', 'No. Keep the sealed tube in a cool, dry place away from direct sunlight until mailing.'],
        ['When should I post my Sports Performance Test sample?', 'Post your sample on Monday or Tuesday where possible to avoid weekend delays.'],
        ['Do I have to pay for return postage?', 'No. UK kits include prepaid return postage.'],
        ['How soon should I send my sample after collection?', 'Send your sample as soon as possible after collection to ensure optimal DNA stability.'],
        ['What should I do immediately before collecting my saliva sample?', 'About 30 minutes before collection, rinse your mouth with drinking water. Then avoid eating, drinking, smoking, vaping, chewing gum, or brushing your teeth.']
      ]},
      { name: 'Results and reporting', qs: [
        ['What does the Sports Performance DNA Test analyse?', 'The test analyses specific genetic markers related to endurance capacity, muscle fibre composition, power and strength potential, recovery speed, injury risk, inflammation response, metabolism and nutrient utilisation, and training response.'],
        ['How long does it take to receive Sports Performance Test results?', 'Results are typically ready within approximately three weeks after your sample reaches the lab.'],
        ['How accurate is the Sports Performance DNA Test?', 'We use validated laboratory sequencing methods and strict quality controls to ensure high analytical accuracy of your genetic markers.'],
        ['Can the Sports Performance Test diagnose medical conditions?', 'No. This test does not diagnose diseases or medical conditions. It provides genetic insights to help inform training and performance decisions.'],
        ['What will my Sports Performance report include?', 'Your report may include genetic performance profile, endurance vs power tendencies, muscle fibre insights, recovery and inflammation markers, nutrient metabolism markers, personalised training recommendations, and nutritional guidance suggestions.'],
        ['Can I share my Sports Performance Test results with a coach or trainer?', 'Yes. You can download and share your report with your coach, trainer, or healthcare professional.'],
        ['Does the test predict athletic success?', 'No genetic test can guarantee success. The Sports Performance Test provides insights into genetic predispositions, which must be combined with training, discipline, and lifestyle factors.']
      ]},
      { name: 'Troubleshooting and support', qs: [
        ['My kit hasn’t arrived or is missing items. What should I do?', 'Contact our support team and we will send replacements or a new kit promptly.'],
        ['I lost my Kit ID. What should I do?', 'Reach out with your order details and we will help verify your purchase and assist with activation.'],
        ['What if my saliva sample leaked or spilled?', 'Do not send the sample. Dispose of the kit and contact us for a replacement.'],
        ['My sample was delayed in the post. Will it still be valid?', 'The preservation solution stabilises DNA during transport. If you are concerned about delays, contact our support team for guidance.'],
        ['Is my genetic information secure?', 'Yes. We use secure systems and strict data protection protocols. Your genetic data is never shared without your consent.']
      ]},
      { name: 'Retesting and frequency', qs: [
        ['Do I need to retake the Sports Performance DNA Test?', 'No. Your DNA does not change over time, so this test typically only needs to be taken once.'],
        ['When would I need to retest?', 'Retesting may only be required if your sample was insufficient, your kit expired, or new panels or expanded features are introduced.'],
        ['How long is the Sports Performance Test kit valid?', 'The kit is valid for two years from purchase. The expiry date is printed on the packaging.']
      ]},
      { name: 'Ordering and logistics', qs: [
        ['Can I order the Sports Performance Test without a referral?', 'Yes. You can order directly from phenomelongevity.com'],
        ['Do you ship internationally?', 'We ship within the UK and to selected countries. UK orders include prepaid return postage.'],
        ['Can I order multiple Sports Performance kits?', 'Yes. Each individual must register their own kit separately to receive a personalised report.']
      ]},
      { name: 'General questions', qs: [
        ['What is a Sports Performance DNA Test?', 'A Sports Performance DNA Test analyses specific genetic markers linked to athletic traits, recovery, metabolism, and injury risk to help inform training strategies.'],
        ['Is the Sports Performance Test suitable for professional athletes?', 'Yes. The test is suitable for recreational athletes, competitive athletes, and professional sportspeople seeking personalised genetic insights.'],
        ['Is the Sports Performance Test invasive?', 'No. The test requires only a saliva sample and is completely noninvasive.'],
        ['Can this test replace professional coaching?', 'No. The test complements professional coaching but does not replace structured training programs or medical advice.'],
        ['What should I do if my question is not answered here?', 'Please contact our support team via email or live chat for personalised assistance.']
      ]}
    ]
  });

  TG.push({ id: 'carrier-screening', name: 'Carrier Screening Test',
    desc: 'For anyone planning a family: eligibility, sampling, results and counselling.',
    groups: [
      { name: 'Eligibility and pre test requirements', qs: [
        ['Who should take a carrier screening test?', 'The Carrier Screening Test is designed for adults aged 18 and over who want to understand whether they carry genetic variants associated with inherited conditions.'],
        ['Can I take the carrier screening test if I am planning a pregnancy?', 'Yes. Carrier screening is particularly useful for individuals or couples planning a pregnancy, as it helps assess the risk of passing certain inherited conditions to a child.'],
        ['Can I take the test if I am already pregnant?', 'If you are pregnant, we recommend speaking with your healthcare provider before taking the test. Carrier screening can still provide useful information, but medical guidance is advised.'],
        ['Can both partners take the carrier screening test?', 'Yes. Carrier screening is often most informative when both partners are tested, as some inherited conditions require both parents to carry a variant for a child to be affected.'],
        ['Do I need to stop medications before taking the carrier screening test?', 'No. Your DNA does not change based on medications. Continue prescribed medication unless advised otherwise by your healthcare provider.'],
        ['Can I take the test if I have braces, dentures, or dental implants?', 'Yes. Braces and implants are fine. Remove removable appliances such as dentures or retainers before collection, and avoid denture adhesive on the day of testing.'],
        ['Can I take the test if I’m on long term medication?', 'Yes. Long term medications such as antihistamines or immunosuppressants are generally fine. Be sure to note them during registration and consult your doctor if you have concerns.'],
        ['Should I maintain my normal lifestyle before testing?', 'Yes. Aside from the temporary pre collection restrictions, maintain your usual routine so your sample reflects your baseline state.']
      ]},
      { name: 'Kit contents and activation', qs: [
        ['What is included in the carrier screening test kit?', 'Your kit includes:\n• Instruction leaflet, saliva collection funnel and tube\n• DNA preservation solution\n• Extra red sealing cap\n• Prepaid return envelope'],
        ['Do I need to register my carrier screening kit before collecting my sample?', 'Yes. Registration is required before sample collection so your DNA can be linked securely to your account.'],
        ['How do I activate or register my carrier screening test kit?', 'Download our app “Phenome Longevity”. If you are new, select “Sign Up” and register with your email. Then, enter your Kit ID and personal details to link the test to your account. Alternatively, visit phenomeportal.org/activate. If you are new, select “I’m New to Phenome Longevity” to create an account. Enter your Kit ID and personal details to link the test to your account.'],
        ['Why is activation required before sending my sample?', 'Registration ensures your sample is processed accurately and your results are delivered securely to the correct profile.'],
        ['What information do I provide during registration?', 'You’ll provide basic details such as your name and email address. This allows us to notify you when your results are ready.']
      ]},
      { name: 'Sample collection and sending', qs: [
        ['How do I collect my saliva sample for the carrier screening test?', '• Rinse your mouth with water 30 minutes before collection. Avoid food, drink, smoking, vaping, chewing gum, or brushing teeth during that period.\n• Spit into the funnel until saliva reaches the 2 ml mark.\n• Add the preservation solution.\n• Remove the funnel.\n• Seal with the red cap.\n• Invert the tube 10 times to mix.'],
        ['What if I have trouble producing enough saliva?', 'Relax and allow saliva to build naturally. Thinking about food or gently moving your tongue may help stimulate saliva production.'],
        ['Do I need to refrigerate my saliva sample?', 'No. Keep the sealed tube in a cool, dry place away from direct sunlight until mailing.'],
        ['When should I post my sample?', 'Post your sample on Monday or Tuesday where possible to avoid weekend delays.'],
        ['Is return postage included?', 'Yes. UK kits include prepaid return postage.'],
        ['How quickly should I send my sample after collection?', 'Send your sample as soon as possible after mixing it with the preservation solution to maintain DNA quality.'],
        ['What should I avoid before collecting my saliva sample?', 'For 30 minutes before collection, do not eat, drink, smoke, vape, chew gum, or brush your teeth. About 30 minutes beforehand, rinse your mouth with plain water and then wait.']
      ]},
      { name: 'Results and reporting', qs: [
        ['What does the carrier screening test analyse?', 'The test analyses specific genetic variants associated with inherited conditions. It identifies whether you carry genetic changes that could be passed on to your children.'],
        ['How long does it take to receive carrier screening results?', 'Results are typically available within approximately three weeks after your sample reaches the laboratory.'],
        ['How accurate is the carrier screening test?', 'We use validated sequencing technology and strict laboratory quality controls to ensure high analytical accuracy for the variants tested.'],
        ['Can the carrier screening test diagnose a disease?', 'No. The test identifies carrier status. It does not diagnose disease or predict whether you personally will develop a condition.'],
        ['What does it mean if I am a carrier?', 'Being a carrier means you have one copy of a genetic variant associated with a condition. Carriers are usually healthy but may pass the variant to their children.'],
        ['What happens if both partners are carriers of the same condition?', 'If both partners carry variants in the same gene, there may be an increased risk of having a child affected by that condition. In such cases, we recommend consulting a genetic counsellor or healthcare provider.'],
        ['Will my report explain my results clearly?', 'Yes. Your report includes clear identification of detected carrier variants, plain language explanations, inheritance pattern information, guidance on next steps, and recommendations for professional consultation if needed.'],
        ['Can I share my carrier screening results with my doctor?', 'Yes. You can download your report and share it with your healthcare provider or a fertility specialist.'],
        ['Do you offer genetic counselling?', 'Optional genetic counselling may be available to help you understand your results and discuss family planning options.']
      ]},
      { name: 'Troubleshooting and support', qs: [
        ['My kit hasn’t arrived or is missing parts. What should I do?', 'Contact our support team and we will send replacements or a new kit promptly.'],
        ['I lost my Kit ID. What should I do?', 'Reach out with your order details and we will help verify your purchase and assist with activation.'],
        ['What if my saliva sample leaked or spilled?', 'Do not send the sample. Dispose of the kit and contact us for a replacement.'],
        ['My sample was delayed in the post. Will it still be valid?', 'The preservation solution stabilises DNA during transport. If you are concerned about delays, contact our support team for guidance.'],
        ['Is my genetic data secure?', 'Yes. We follow strict data protection standards and secure storage protocols. Your genetic data is never shared without your consent.']
      ]},
      { name: 'Retesting and frequency', qs: [
        ['Do I need to retake the carrier screening test?', 'No. Your DNA does not change, so carrier screening usually only needs to be done once.'],
        ['When would I need to retest?', 'Retesting may be recommended if:\n• Your original sample was insufficient\n• New genetic panels are introduced\n• You wish to test a partner separately'],
        ['How long is the carrier screening test kit valid?', 'The kit is valid for two years from purchase. The expiry date is printed on the packaging.']
      ]},
      { name: 'Ordering and logistics', qs: [
        ['Can I order the carrier screening test without a referral?', 'Yes. You can order directly from phenomelongevity.com'],
        ['Do you ship internationally?', 'We ship within the UK and to selected countries. UK orders include prepaid return postage.'],
        ['Can couples order two kits?', 'Yes. Each partner must use and register their own kit to receive individual results.']
      ]},
      { name: 'General questions', qs: [
        ['What is a carrier screening test?', 'A carrier screening test analyses your DNA to determine whether you carry genetic variants linked to inherited conditions that could be passed on to your children.'],
        ['Who should consider carrier screening?', 'Carrier screening is often recommended for individuals planning pregnancy, couples undergoing fertility treatment, those with a family history of genetic conditions, and anyone seeking proactive reproductive health insight.'],
        ['Is the carrier screening test painful?', 'No. The test requires only a saliva sample and is completely noninvasive.'],
        ['Does being a carrier mean I am sick?', 'No. Carriers are typically healthy. Carrier status only indicates potential reproductive risk if a partner carries the same genetic variant.'],
        ['What should I do if my question is not answered here?', 'Please contact our support team via email or live chat for personalised assistance.']
      ]}
    ]
  });

  /* ======================================================================
     SUPPLEMENTS
     ==================================================================== */
  T.push({
    id: 'supplements', name: 'Supplements', title: 'The Phenome+ range',
    desc: 'Dosing, ingredients, safety and storage for every supplement we make.',
    glyph: 'capsule',
    groups: [
      { name: 'Ingredients & quality', qs: [
        ['Are supplements covered by insurance?', 'No. Supplements are purchased directly and are not typically covered by health insurance.'],
        ['Where are Phenome Longevity supplements manufactured?', 'Our supplements are manufactured in regulated facilities that comply with UK and EU safety standards.'],
        ['What makes Phenome Longevity supplements different?', 'Our formulas are designed with:\n• Scientifically informed ingredient selection\n• Bioavailability focused delivery systems\n• Targeted health optimisation\n• Premium quality sourcing'],
        ['Do your supplements use clinically studied ingredients?', 'Many of our formulas include ingredients supported by scientific research. Specific study references may be available upon request.'],
        ['What is the difference between liposomal and regular supplements?', 'Liposomal supplements use lipid based delivery systems that may enhance absorption compared to traditional capsules or tablets.']
      ]},
      { name: 'Safety & side effects', qs: [
        ['Are Phenome Longevity supplements safe?', 'Yes. Our supplements are manufactured under strict quality standards and are formulated using evidence informed ingredients. However, they are not intended to diagnose, treat, cure, or prevent disease.'],
        ['Are your supplements regulated?', 'Our supplements are produced in facilities that follow Good Manufacturing Practice (GMP) standards and comply with UK and EU food supplement regulations.'],
        ['Can I take Phenome Longevity supplements with medication?', 'If you are taking prescription medication, pregnant, breastfeeding, or managing a medical condition, consult your doctor before starting any supplement.'],
        ['Are your supplements suitable for pregnant or breastfeeding women?', 'Unless explicitly stated on the product page, supplements are not automatically suitable during pregnancy or breastfeeding. Always consult a healthcare professional first.'],
        ['Can I take multiple Phenome supplements together?', 'Many supplements can be taken together. However, we recommend reviewing product labels and consulting a healthcare professional if combining multiple formulas.'],
        ['How long does it take to see results from supplements?', 'Results vary depending on the supplement and the individual. Some products may provide noticeable effects within days, while others may require consistent use over several weeks.'],
        ['Do your supplements contain allergens?', 'Each product page lists allergen information. Always review the ingredient list carefully if you have allergies or sensitivities.'],
        ['Are your supplements vegan or vegetarian?', 'Many of our supplements are vegan friendly. Please check individual product pages for confirmation.'],
        ['Are your supplements third party tested?', 'We use quality controlled manufacturing processes. Where applicable, we conduct or request third party testing to verify purity and potency.'],
        ['Are Phenome supplements intended to treat medical conditions?', 'No. Our supplements are designed to support general wellness and are not intended to diagnose, treat, cure, or prevent disease.']
      ]},
      { name: 'Storage & shelf life', qs: [
        ['How should I store my supplements?', 'Store supplements in a cool, dry place away from direct sunlight. Keep bottles tightly sealed.'],
        ['Can I return a supplement?', 'Unopened supplements may be eligible for return. Due to safety and hygiene reasons, opened products cannot be refunded unless defective.'],
        ['How long are supplements valid?', 'Each product has an expiry date printed on the packaging. Do not consume after this date.'],
        ['Do you ship supplements internationally?', 'We ship within the UK and selected countries. Shipping times and costs vary by location.']
      ]}
    ],
    guidesLabel: 'Your specific supplement', guideKind: 'product guides',
    guides: []
  });

  var SG = T[1].guides;

  /* The lozenges share most of their wording; each keeps its own where the
     source differs. */
  SG.push({ id: 'propolis', name: 'Propolis Throat Lozenges',
    desc: 'Propolis lozenges: ingredients, dosage, safety and storage.',
    groups: [
      { name: 'About Propolis Throat Lozenges', qs: [
        ['What are Propolis Throat Lozenges used for?', 'Propolis Throat Lozenges are designed to support throat comfort and soothe irritation. They provide targeted support for dry, scratchy, or overused throats, particularly during seasonal changes or high vocal demand.'],
        ['What is propolis?', 'Propolis is a natural resin like substance produced by bees from plant compounds. It has traditionally been used to support oral and throat health due to its protective and soothing properties.'],
        ['How do Propolis Throat Lozenges work?', 'Propolis helps create a soothing coating in the throat while supporting the natural barrier of the oral mucosa. When slowly dissolved, the lozenge allows active ingredients to interact directly with the throat lining.'],
        ['When should I use Propolis Throat Lozenges?', 'You may use them if you are experiencing:\n• Throat dryness\n• Irritation from speaking or singing\n• Seasonal throat discomfort\n• Exposure to dry air or pollution\n\nThey are suitable for daily throat support when needed.'],
        ['Who are Propolis Throat Lozenges suitable for?', 'They are suitable for adults who want natural throat support, including:\n• Professionals who use their voice frequently\n• Individuals experiencing seasonal throat sensitivity\n• Those seeking a plant based soothing lozenge'],
        ['Who should avoid Propolis Throat Lozenges?', 'Do not use if:\n• You are allergic to bee products\n• You have a known sensitivity to propolis or pollen\n\nIf pregnant, breastfeeding, or under medical supervision, consult a healthcare professional before use.']
      ]},
      { name: 'Ingredients and formulation', qs: [
        ['What ingredients are in Propolis Throat Lozenges?', 'Each lozenge contains:\n• Propolis extract\n• Soothing excipients\n• Natural flavour system\n\nPlease refer to the product label for the full ingredient list.'],
        ['Is the propolis standardised?', 'Our propolis extract is sourced under quality controlled conditions. Standardisation details may be available upon request.'],
        ['Are the lozenges natural?', 'Propolis is naturally derived. The formula is developed to prioritise quality ingredients and avoid unnecessary additives.'],
        ['Do Propolis Throat Lozenges contain artificial colours or preservatives?', 'Please refer to the ingredient label. Our formulations aim to minimise artificial additives where possible.'],
        ['Are these lozenges vegan?', 'No. Propolis is a bee derived ingredient and is not suitable for vegans.']
      ]},
      { name: 'Usage and dosage', qs: [
        ['How do I take Propolis Throat Lozenges?', 'Allow one lozenge to slowly dissolve in your mouth. Do not chew or swallow whole.'],
        ['How many Propolis Lozenges can I take per day?', 'Follow the dosage instructions on the packaging. Do not exceed the recommended daily intake.'],
        ['Can I take Propolis Lozenges daily?', 'Yes, they may be used daily when throat support is needed. For prolonged use, consult a healthcare professional.'],
        ['Can I use these lozenges before speaking or singing?', 'Yes. Many people use throat lozenges before presentations, performances, or long conversations to support comfort.']
      ]},
      { name: 'Safety and side effects', qs: [
        ['Are the Propolis Throat Lozenges safe?', 'When used as directed, they are generally well tolerated. However, individuals allergic to bee products should avoid them.'],
        ['Can Propolis Lozenges cause allergic reactions?', 'Yes, if you are allergic to bee products, pollen, or propolis. Discontinue use if irritation or allergic symptoms occur.'],
        ['Can children take Propolis Throat Lozenges?', 'These lozenges are formulated for adults.'],
        ['Can I take Propolis Lozenges while on medication?', 'If you are taking medication or managing a health condition, consult your healthcare provider before use.'],
        ['Are Propolis Throat Lozenges safe during pregnancy?', 'If pregnant or breastfeeding, consult your healthcare provider before use.']
      ]},
      { name: 'Storage and shelf life', qs: [
        ['How should I store Propolis Throat Lozenges?', 'Store in a cool, dry place away from direct sunlight.'],
        ['What is the shelf life?', 'Please check the expiration date printed on the packaging.']
      ]},
      { name: 'Ordering and general questions', qs: [
        ['Can I combine Propolis Lozenges with other Phenome supplements?', 'Yes, they can generally be used alongside other supplements. Review individual product labels for compatibility.'],
        ['Do Propolis Lozenges replace medical treatment?', 'No. These lozenges are designed to support throat comfort and are not intended to diagnose, treat, cure, or prevent disease.'],
        ['What should I do if my throat discomfort persists?', 'If throat symptoms persist or worsen, consult a healthcare professional.']
      ]}
    ]
  });

  SG.push({ id: 'pelargonium', name: 'Pelargonium Throat Lozenges',
    desc: 'Pelargonium lozenges: ingredients, dosage, safety and storage.',
    groups: [
      { name: 'About Pelargonium Throat Lozenges', qs: [
        ['What are Pelargonium Throat Lozenges for?', 'Pelargonium Throat Lozenges are designed to support throat comfort and respiratory wellbeing, particularly during seasonal changes or periods of throat irritation.'],
        ['What is pelargonium?', 'Pelargonium (Pelargonium sidoides) is a plant traditionally used in herbal preparations to support respiratory health and throat comfort.'],
        ['How do Pelargonium Throat Lozenges work?', 'When slowly dissolved, the lozenge allows pelargonium extract to coat the throat, supporting natural mucosal comfort and helping maintain throat clarity.'],
        ['When should I use Pelargonium Throat Lozenges?', 'You may use them during:\n• Seasonal throat sensitivity\n• Changes in weather\n• Mild throat discomfort\n• Times of increased vocal strain\n\nThey are ideal for short term supportive use.'],
        ['Who are Pelargonium Lozenges suitable for?', 'They are suitable for adults seeking plant based throat support, particularly during colder seasons or environmental changes.'],
        ['Who should avoid Pelargonium Lozenges?', 'Do not use if:\n• You are allergic to pelargonium or related plants\n• You have a known sensitivity to herbal extracts\n\nIf pregnant, breastfeeding, or under medical supervision, consult a healthcare professional before use.']
      ]},
      { name: 'Ingredients and formulation', qs: [
        ['What ingredients are in Pelargonium Throat Lozenges?', 'Each lozenge contains:\n• Pelargonium extract\n• Soothing lozenge base\n• Natural flavour system\n\nRefer to the packaging for the complete ingredient list.'],
        ['Is the pelargonium extract standardised?', 'Our pelargonium extract is sourced under controlled quality conditions. Standardisation details may be available upon request.'],
        ['Are the lozenges natural?', 'Pelargonium is plant derived. The formula is designed to prioritise quality herbal sourcing while maintaining stability and consistency.'],
        ['Do Pelargonium Lozenges contain artificial colours or preservatives?', 'Please refer to the ingredient list. Our formulations aim to minimise unnecessary additives.'],
        ['Are Pelargonium Lozenges vegan?', 'Pelargonium is plant derived. Please check the ingredient list to confirm suitability based on your dietary preferences.']
      ]},
      { name: 'Usage and dosage', qs: [
        ['How do I take Pelargonium Throat Lozenges?', 'Allow one lozenge to slowly dissolve in the mouth. Do not chew or swallow whole.'],
        ['How many Pelargonium Lozenges can I take per day?', 'Follow the recommended daily intake printed on the packaging. Do not exceed the stated dose.'],
        ['Can I use Pelargonium Lozenges daily?', 'They are intended for short term supportive use. If symptoms persist, consult a healthcare professional.'],
        ['Can I take Pelargonium Lozenges before speaking or presentations?', 'Yes. They may help support throat comfort before extended speaking.']
      ]},
      { name: 'Safety and side effects', qs: [
        ['Are Pelargonium Throat Lozenges safe?', 'When taken as directed, they are generally well tolerated. Always follow the dosage instructions.'],
        ['Are there any side effects?', 'Pelargonium is generally well tolerated. Discontinue use if you experience irritation or sensitivity.'],
        ['Can children take Pelargonium Lozenges?', 'These lozenges are formulated for adults. Keep out of reach of children.'],
        ['Can I take Pelargonium Lozenges while on medication?', 'If you are taking medication or have a medical condition, consult your healthcare provider before use.'],
        ['Are Pelargonium Lozenges safe during pregnancy or breastfeeding?', 'Consult a healthcare professional before use if pregnant or breastfeeding.']
      ]},
      { name: 'Storage and shelf life', qs: [
        ['How should I store Pelargonium Throat Lozenges?', 'Store in a cool, dry place away from direct sunlight.'],
        ['What is the shelf life?', 'Check the expiration date printed on the packaging.']
      ]},
      { name: 'Ordering and general questions', qs: [
        ['Can I combine Pelargonium Lozenges with Propolis Lozenges?', 'Yes, they can generally be used alongside other throat support products. Review dosage instructions and consult a professional if unsure.'],
        ['Do Pelargonium Lozenges treat infections?', 'No. These lozenges support throat comfort but are not intended to diagnose, treat, cure, or prevent disease.'],
        ['What should I do if my throat symptoms persist?', 'If throat discomfort continues or worsens, seek medical advice.']
      ]}
    ]
  });

  SG.push({ id: 'throat-relief', name: 'Throat Relief Lozenges',
    desc: 'Throat Relief lozenges: ingredients, dosage, safety and storage.',
    groups: [
      { name: 'About Throat Relief Lozenges', qs: [
        ['What are Throat Relief Lozenges used for?', 'Throat Relief Lozenges are designed to soothe dry, irritated, or scratchy throats. They provide targeted comfort and hydration support, especially during seasonal changes or periods of increased vocal use.'],
        ['How do Throat Relief Lozenges work?', 'When slowly dissolved, the lozenge releases soothing ingredients that coat the throat lining, helping to maintain moisture and support natural comfort.'],
        ['When should I use Throat Relief Lozenges?', 'You may use them when experiencing:\n• Throat dryness\n• Irritation from talking, singing or presentations\n• Seasonal throat sensitivity\n• Exposure to air conditioning, heating, or dry air\n\nThey are suitable for short term supportive use.'],
        ['Who are the Throat Relief Lozenges suitable for?', 'They are suitable for adults seeking fast acting throat comfort, including:\n• Teachers and public speakers\n• Singers and performers\n• Office professionals\n• Individuals experiencing seasonal throat dryness'],
        ['Who should avoid Throat Relief Lozenges?', 'Avoid use if you are sensitive to any of the listed ingredients. If pregnant, breastfeeding, or managing a medical condition, consult a healthcare professional before use.']
      ]},
      { name: 'Ingredients and formulation', qs: [
        ['What ingredients are in Throat Relief Lozenges?', 'Each lozenge contains a blend of soothing agents designed to support throat comfort. Please refer to the packaging for the full ingredient list.'],
        ['Do these lozenges contain artificial colours or preservatives?', 'Please check the ingredient label. Our formulations are designed to minimise unnecessary additives.'],
        ['Are Throat Relief Lozenges natural?', 'Our formulation prioritises quality ingredients and balanced flavour systems. Specific ingredient origins are listed on the product label.'],
        ['Are Throat Relief Lozenges vegan?', 'Please refer to the ingredient list for confirmation of dietary suitability.'],
        ['Do Throat Relief Lozenges contain sugar?', 'Refer to the nutritional panel on the packaging for sugar content information.']
      ]},
      { name: 'Usage and dosage', qs: [
        ['How do I take Throat Relief Lozenges?', 'Allow one lozenge to slowly dissolve in your mouth. Do not chew or swallow whole.'],
        ['How many Throat Relief Lozenges can I take per day?', 'Follow the recommended daily intake printed on the packaging. Do not exceed the stated dose.'],
        ['Can I take Throat Relief Lozenges daily?', 'They can be used daily when needed for throat comfort. If symptoms persist, consult a healthcare professional.'],
        ['Can I use Throat Relief Lozenges before speaking or singing?', 'Yes. Many people use throat lozenges before extended vocal activity to support comfort.']
      ]},
      { name: 'Safety and side effects', qs: [
        ['Are Throat Relief Lozenges safe?', 'When used as directed, they are safe and generally well tolerated.'],
        ['Are there any side effects?', 'Side effects are uncommon. If irritation or sensitivity occurs, discontinue use.'],
        ['Can children take Throat Relief Lozenges?', 'These lozenges are formulated for adults. Keep out of reach of children.'],
        ['Can I take Throat Relief Lozenges while on medication?', 'If you are taking medication or have a medical condition, consult your healthcare provider before use.'],
        ['Are Throat Relief Lozenges safe during pregnancy and breastfeeding?', 'Consult a healthcare professional before use if pregnant or breastfeeding.']
      ]},
      { name: 'Storage and shelf life', qs: [
        ['How should I store Throat Relief Lozenges?', 'Store in a cool, dry place away from direct sunlight.'],
        ['What is the shelf life?', 'Please check the expiration date printed on the packaging.']
      ]},
      { name: 'Ordering and general questions', qs: [
        ['Can I combine Throat Relief Lozenges with Propolis or Pelargonium Lozenges?', 'Yes, they can generally be used alongside other throat support products. Review dosage guidelines and consult a professional if unsure.'],
        ['Do Throat Relief Lozenges treat infections?', 'No. These lozenges are designed to support throat comfort and are not intended to diagnose, treat, cure, or prevent disease.'],
        ['What should I do if throat discomfort persists?', 'If throat irritation continues or worsens, consult a healthcare professional.']
      ]}
    ]
  });

  SG.push({ id: 'broccoli', name: 'Broccoli Capsules',
    desc: 'Broccoli (sulforaphane) capsules, how they work, dosing and safety.',
    groups: [
      { name: 'About Broccoli Capsules', qs: [
        ['What are Broccoli Capsules used for?', 'Broccoli Capsules are designed to support cellular health, antioxidant defence, and natural detoxification pathways. They typically provide concentrated compounds found in broccoli, including glucoraphanin, which the body converts into sulforaphane.'],
        ['What is sulforaphane?', 'Sulforaphane is a naturally occurring compound derived from broccoli and other cruciferous vegetables. It has been studied for its role in supporting antioxidant activity and cellular protection.'],
        ['What is glucoraphanin?', 'Glucoraphanin is a precursor compound found in broccoli. When combined with the enzyme myrosinase, it can be converted into sulforaphane inside the body.'],
        ['Why not just eat broccoli?', 'Eating broccoli is beneficial, but the amount of glucoraphanin can vary widely depending on preparation and cooking methods. Broccoli supplements provide a more standardised and convenient intake.'],
        ['Who should take Broccoli Capsules?', 'They may be suitable for adults seeking support for:\n• Antioxidant defence\n• Cellular protection\n• Healthy ageing strategies\n• Environmental stress exposure'],
        ['Who should avoid Broccoli Capsules?', 'Consult your healthcare provider before use if:\n• You are pregnant or breastfeeding\n• You have a thyroid condition\n• You are taking medications\n• You have a sensitivity to cruciferous vegetables']
      ]},
      { name: 'Ingredients and mechanism', qs: [
        ['What ingredients are in Broccoli Capsules?', 'Broccoli Capsules typically contain:\n• Broccoli extract (source of glucoraphanin)\n• Cinnamon extract\n• Alpha lipoic acid\n• Magnesium taurate\n• Chromium\n\nPlease refer to the product label for full ingredient details.'],
        ['How do Broccoli Capsules work in the body?', 'Broccoli derived compounds may support activation of natural antioxidant pathways in the body. Sulforaphane has been studied for its role in supporting cellular defence mechanisms.'],
        ['Is the dosage clinically relevant?', 'Our formulation is designed to align with research informed ranges. Exact standardisation levels can be provided upon request.'],
        ['Does this supplement contain active sulforaphane?', 'Some formulas provide glucoraphanin plus myrosinase to support in body conversion. Check the product label for details on the active format used.'],
        ['Are Broccoli Capsules vegan?', 'Yes. Our broccoli supplement is plant derived.']
      ]},
      { name: 'Usage and timing', qs: [
        ['How should I take Broccoli Capsules?', 'Take the recommended number of capsules daily with water. Follow the dosage instructions printed on the packaging.'],
        ['Should I take Broccoli Capsules with food?', 'Taking with food is generally recommended to support absorption and reduce stomach sensitivity.'],
        ['How long should I take Broccoli Capsules?', 'Broccoli extract may be used consistently as part of a long term wellness routine. If unsure, consult a healthcare professional.'],
        ['Can I combine Broccoli Capsules with other antioxidants?', 'Yes, they can generally be combined with other antioxidant support supplements. Review labels and consult a healthcare professional if stacking multiple formulas.']
      ]},
      { name: 'Benefits and expectations', qs: [
        ['What benefits might I notice?', 'Individual experiences vary. Some people incorporate broccoli extract as part of a broader antioxidant or longevity focused strategy.'],
        ['How long does it take to see results?', 'Broccoli compounds work at the cellular level. Consistent use over several weeks is typically recommended.'],
        ['Does this supplement support detoxification?', 'Broccoli derived compounds have been studied for their role in supporting the body’s natural detoxification systems. This supplement supports those natural processes but does not “detox” in a medical sense.']
      ]},
      { name: 'Safety and side effects', qs: [
        ['Are Broccoli Capsules safe?', 'When taken as directed, they are generally well tolerated.'],
        ['Are there any side effects?', 'Possible mild side effects may include digestive discomfort. Discontinue use if adverse reactions occur.'],
        ['Can I take Broccoli Capsules long term?', 'Broccoli derived compounds are commonly consumed in the diet. Long term supplementation should be discussed with a healthcare provider if you have concerns.'],
        ['Are Broccoli Capsules safe for people with thyroid conditions?', 'Cruciferous vegetables may influence thyroid function in certain contexts. If you have a thyroid condition, consult your healthcare provider before use.']
      ]},
      { name: 'Storage and shelf life', qs: [
        ['How should I store Broccoli Capsules?', 'Store in a cool, dry place away from direct sunlight. Keep the bottle tightly sealed.'],
        ['What is the shelf life?', 'Refer to the expiration date printed on the packaging.']
      ]},
      { name: 'Ordering and general questions', qs: [
        ['Can I combine Broccoli Capsules with NAD+ or other longevity supplements?', 'Yes. Many customers incorporate broccoli extract into a broader longevity protocol. Review dosage instructions and consult a professional if unsure.'],
        ['Do Broccoli Capsules treat disease?', 'No. This supplement is not intended to diagnose, treat, cure, or prevent any disease.'],
        ['What should I do if I experience unusual symptoms?', 'Discontinue use and consult a healthcare professional.']
      ]}
    ]
  });

  SG.push({ id: 'bromelain', name: 'Bromelain Capsules',
    desc: 'Bromelain capsules, how they work, dosing and safety.',
    groups: [
      { name: 'About Bromelain Capsules', qs: [
        ['What are Bromelain Capsules used for?', 'Bromelain Capsules are designed to support digestive comfort, protein breakdown, and natural inflammatory balance. Bromelain is an enzyme derived from pineapple that has traditionally been used to support digestion and tissue recovery.'],
        ['What is Bromelain?', 'Bromelain is a group of proteolytic (protein digesting) enzymes naturally found in pineapple stems. It is commonly used as a digestive enzyme and for general wellness support.'],
        ['How does Bromelain work in the body?', 'Bromelain helps break down proteins into smaller peptides and amino acids, supporting digestion. It has also been studied for its role in supporting normal inflammatory responses in the body.'],
        ['Who should take Bromelain Capsules?', 'Bromelain may be suitable for adults seeking support for:\n• Protein digestion\n• Digestive comfort\n• Post exercise recovery\n• General inflammatory balance'],
        ['Who should avoid Bromelain Capsules?', 'Consult your healthcare provider before use if:\n• You are pregnant or breastfeeding\n• You have a bleeding disorder\n• You are taking blood thinning medication\n• You are allergic to pineapple']
      ]},
      { name: 'Ingredients and formulation', qs: [
        ['What ingredients are in Bromelain Capsules?', 'Bromelain capsules typically contain:\n• Bromelain (measured in enzyme activity units, such as GDU or MCU)\n• Capsule shell\n• Minimal excipients\n\nRefer to the product label for exact ingredient details.'],
        ['What does “GDU” or “MCU” mean?', 'GDU (Gelatin Digesting Units) and MCU (Milk Clotting Units) measure the enzymatic activity of bromelain. Higher activity indicates greater protein digesting capacity.'],
        ['Is your Bromelain standardised?', 'Our bromelain extract is standardised for enzymatic activity to ensure consistent potency. Specific activity levels are listed on the product label.'],
        ['Is bromelain derived from pineapple fruit?', 'Most supplemental bromelain is extracted from pineapple stems rather than fruit, as the stems contain higher enzyme concentrations.'],
        ['Is Bromelain vegan?', 'Yes. Bromelain is plant derived and typically suitable for vegetarian and vegan diets (check capsule type on label).']
      ]},
      { name: 'Usage and timing', qs: [
        ['How should I take Bromelain Capsules?', 'Take the recommended number of capsules with water, following the dosage instructions on the packaging.'],
        ['Should I take bromelain with or without food?', 'For digestive support: take with meals.\n\nFor general systemic support: some individuals take it between meals.\n\nFollow product guidance or consult a healthcare professional.'],
        ['How long should I take Bromelain Capsules?', 'Duration of use depends on your wellness goals. Some people use bromelain short term, while others include it in longer term protocols.'],
        ['Can I combine Bromelain with other supplements?', 'Yes, bromelain is often combined with:\n• Quercetin\n• Curcumin\n• Vitamin C\n\nReview product labels and consult a healthcare professional if stacking multiple supplements.']
      ]},
      { name: 'Benefits and expectations', qs: [
        ['What benefits might I notice?', 'Individual results vary. Some people use bromelain for digestive comfort, while others include it as part of recovery focused routines.'],
        ['How long does it take to notice effects?', 'Digestive effects may be noticeable relatively quickly. Systemic benefits typically require consistent use over time.'],
        ['Does bromelain reduce inflammation?', 'Bromelain has been studied for its role in supporting normal inflammatory responses. However, it is not a treatment for inflammatory diseases.'],
        ['Can bromelain help with bloating?', 'Bromelain supports protein digestion, which may contribute to digestive comfort when taken with meals.']
      ]},
      { name: 'Safety and side effects', qs: [
        ['Are Bromelain Capsules safe?', 'When taken as directed, bromelain is generally well tolerated.'],
        ['Are there any side effects?', 'Some individuals may experience mild digestive discomfort when starting. If symptoms persist, discontinue use and consult a professional.'],
        ['Can bromelain increase bleeding risk?', 'Bromelain may influence blood clotting. If you are taking anticoagulants or have a bleeding condition, consult your healthcare provider before use.'],
        ['Is bromelain safe during pregnancy?', 'Consult your healthcare professional before use if pregnant or breastfeeding.'],
        ['Can I take bromelain long term?', 'Long term use should be discussed with a healthcare professional, particularly if you are taking other medications.']
      ]},
      { name: 'Storage and shelf life', qs: [
        ['How should I store Bromelain Capsules?', 'Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.'],
        ['What is the shelf life?', 'Check the expiration date printed on the packaging.']
      ]},
      { name: 'Ordering and general questions', qs: [
        ['Can I combine Bromelain Capsules with other Phenome Longevity supplements?', 'Yes, bromelain can generally be used alongside other supplements. Review dosage instructions and consult a professional if unsure.'],
        ['Do bromelain capsules treat medical conditions?', 'No. Bromelain Capsules are not intended to diagnose, treat, cure, or prevent disease.'],
        ['What should I do if I experience unusual symptoms?', 'Discontinue use and consult a healthcare professional.']
      ]}
    ]
  });

  SG.push({ id: 'quercetin', name: 'Quercetin Capsules',
    desc: 'Quercetin capsules, how they work, dosing and safety.',
    groups: [
      { name: 'About Quercetin Capsules', qs: [
        ['What is quercetin?', 'Quercetin is a naturally occurring plant flavonoid found in foods such as apples, onions, berries, and capers. It is widely studied for its antioxidant properties and its role in supporting immune and cellular health.'],
        ['What are Quercetin Capsules used for?', 'Quercetin Capsules are typically used to support:\n• Antioxidant defence\n• Immune system balance\n• Healthy inflammatory response\n• Seasonal wellbeing'],
        ['Who should consider taking Quercetin Capsules?', 'Quercetin may be suitable for adults looking to support:\n• Immune resilience\n• Seasonal changes\n• General antioxidant protection\n• Longevity focused wellness strategies'],
        ['Who should avoid Quercetin Capsules?', 'Consult a healthcare provider before use if you:\n• Are pregnant or breastfeeding\n• Take prescription medications\n• Have kidney conditions\n• Have known sensitivities to flavonoids']
      ]},
      { name: 'Ingredients and mechanism', qs: [
        ['How does quercetin work in the body?', 'Quercetin functions primarily as an antioxidant, helping support the body’s natural defence against oxidative stress. It has also been studied for its influence on inflammatory pathways and immune modulation.'],
        ['Is your quercetin standardised?', 'Our quercetin extract is standardised to ensure consistent purity and potency. Specific standardisation details are listed on the product label.'],
        ['Is quercetin bioavailable?', 'Quercetin has moderate natural bioavailability. Some formulations may include complementary ingredients to support absorption. Refer to your product label for details.'],
        ['What is the difference between quercetin and rutin?', 'Quercetin is the active flavonoid compound, while rutin is a glycoside form of quercetin found in certain plants. Supplements typically contain quercetin aglycone for higher potency.'],
        ['Is quercetin vegan?', 'Yes. Quercetin is plant derived and typically suitable for vegetarian and vegan diets (check capsule type for confirmation).']
      ]},
      { name: 'Usage and timing', qs: [
        ['How should I take Quercetin Capsules?', 'Take the recommended number of capsules daily with water, following the dosage instructions on the packaging.'],
        ['Should I take quercetin with food?', 'Taking quercetin with food may improve tolerance and support absorption.'],
        ['Can I take quercetin daily?', 'Many people incorporate quercetin into their daily wellness routine. If you are taking medications or using it long term, consult a healthcare professional.'],
        ['Can I combine quercetin with Vitamin C?', 'Yes. Quercetin and Vitamin C are often paired, as Vitamin C may help support quercetin recycling and antioxidant synergy.'],
        ['Can I combine quercetin with bromelain?', 'Yes. Bromelain is sometimes included alongside quercetin to support absorption and complementary effects.']
      ]},
      { name: 'Benefits and expectations', qs: [
        ['What benefits might I notice?', 'Individual experiences vary. Some individuals use quercetin for seasonal immune support, while others incorporate it into antioxidant focused protocols.'],
        ['How long does quercetin take to work?', 'Antioxidant and immune support supplements typically require consistent use over several weeks for best results.'],
        ['Does quercetin help with seasonal allergies?', 'Quercetin has been studied for its role in immune response modulation. However, it is not a treatment for allergic conditions and should not replace medical care.'],
        ['Is quercetin good for inflammation?', 'Quercetin has been studied for supporting normal inflammatory responses. It is not intended to treat inflammatory diseases.'],
        ['Does quercetin support longevity?', 'As a flavonoid antioxidant, quercetin is often included in longevity focused protocols due to its role in cellular protection.']
      ]},
      { name: 'Safety and side effects', qs: [
        ['Is quercetin safe?', 'When taken as directed, quercetin is generally well tolerated.'],
        ['Are there any side effects?', 'Some individuals may experience mild digestive discomfort or headache at higher doses. If symptoms occur, discontinue use and consult a professional.'],
        ['Can quercetin interact with medications?', 'Quercetin may interact with certain medications. If you are taking prescription drugs, consult your healthcare provider before use.'],
        ['Is quercetin safe during pregnancy?', 'Consult your healthcare professional before use during pregnancy or breastfeeding.'],
        ['Can I take quercetin long term?', 'Long term use should be discussed with a healthcare professional, especially if you have underlying conditions.']
      ]},
      { name: 'Storage and shelf life', qs: [
        ['How should I store Quercetin Capsules?', 'Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.'],
        ['What is the shelf life?', 'Check the expiration date printed on the packaging.']
      ]},
      { name: 'Ordering and general questions', qs: [
        ['Can I stack Quercetin with other Phenome Longevity supplements?', 'Yes. Quercetin is often combined with bromelain, vitamin C, and other antioxidant support formulas.'],
        ['Do Quercetin Capsules diagnose or treat illness?', 'No. This product is not intended to diagnose, treat, cure, or prevent any disease.'],
        ['What should I do if I experience unusual symptoms?', 'Stop using the product and consult a healthcare professional.']
      ]}
    ]
  });

  SG.push({ id: 'guarana', name: 'Guarana Capsules',
    desc: 'Guarana capsules, how they work, dosing and safety.',
    groups: [
      { name: 'About Guarana Capsules', qs: [
        ['What is guarana?', 'Guarana is a plant native to the Amazon region. Its seeds naturally contain caffeine and other plant compounds, which are traditionally used to support energy and mental alertness.'],
        ['What are Guarana Capsules used for?', 'Guarana capsules are commonly used to support:\n• Energy levels\n• Mental focus\n• Alertness\n• Physical performance'],
        ['Does guarana contain caffeine?', 'Yes. Guarana naturally contains caffeine. In fact, it is one of the most concentrated natural sources of caffeine.'],
        ['Is guarana stronger than coffee?', 'Guarana may contain more caffeine per gram than coffee beans. However, the total caffeine intake depends on the dose used in the supplement.'],
        ['Who should take Guarana capsules?', 'Guarana may be suitable for adults looking to support:\n• Daily energy\n• Focus during work or study\n• Physical endurance\n• Reduced fatigue'],
        ['Who should avoid Guarana capsules?', 'Consult your healthcare provider before use if you:\n• Are pregnant or breastfeeding\n• Are sensitive to caffeine\n• Have heart conditions\n• Have high blood pressure\n• Are taking stimulant medications']
      ]},
      { name: 'Ingredients and mechanism', qs: [
        ['How does guarana work in the body?', 'Guarana works primarily due to its caffeine content. Caffeine supports alertness by influencing the central nervous system and reducing feelings of tiredness.'],
        ['How much caffeine is in your Guarana Capsules?', 'The exact caffeine content is listed on the product label. This ensures transparency and helps you monitor your daily caffeine intake.'],
        ['Is guarana different from synthetic caffeine?', 'Yes. Guarana is a natural plant extract. Some people prefer plant derived caffeine sources as part of their wellness routine.'],
        ['Does guarana release caffeine slowly?', 'Because guarana contains caffeine bound within plant compounds, some users report a steadier energy experience compared to coffee. Individual responses may vary.'],
        ['Is guarana vegan?', 'Yes. Guarana is plant derived and typically suitable for vegetarian and vegan diets (check capsule shell type for confirmation).']
      ]},
      { name: 'Usage and timing', qs: [
        ['How should I take Guarana Capsules?', 'Take the recommended dose with water, preferably earlier in the day.'],
        ['Should I take guarana in the morning?', 'Yes. Because guarana contains caffeine, it is best taken in the morning or early afternoon.'],
        ['Can I take guarana at night?', 'It is not recommended to take guarana close to bedtime, as caffeine may interfere with sleep.'],
        ['Can I combine guarana with coffee?', 'You should account for total daily caffeine intake. Combining multiple caffeine sources may increase the risk of overstimulation.'],
        ['How long does guarana last?', 'The effects of caffeine vary by individual but typically last several hours.']
      ]},
      { name: 'Benefits and expectations', qs: [
        ['What benefits might I notice?', 'Individual experiences vary. Many people use guarana for increased alertness and sustained energy during busy days.'],
        ['Does guarana help with fatigue?', 'Caffeine contributes to reduced tiredness and increased alertness.'],
        ['Can guarana support exercise performance?', 'Guarana is often included in performance focused routines due to its caffeine content.'],
        ['Does guarana help with weight loss?', 'Guarana is not a weight loss product. Some individuals include caffeine containing supplements in broader fitness routines, but it does not replace diet or exercise.'],
        ['Is guarana good for focus?', 'Caffeine has been shown to support concentration and alertness.']
      ]},
      { name: 'Safety and side effects', qs: [
        ['Is guarana safe?', 'When used as directed, guarana is generally well tolerated.'],
        ['What are possible side effects?', 'Because guarana contains caffeine, excess intake may cause:\n• Jitters\n• Increased heart rate\n• Nervousness\n• Sleep disruption\n\nIf you experience adverse effects, discontinue use.'],
        ['How much caffeine is too much?', 'Total daily caffeine intake should typically not exceed 400mg for most healthy adults. Always account for coffee, tea, energy drinks, and other sources.'],
        ['Can guarana interact with medications?', 'Caffeine may interact with certain medications. Consult your healthcare provider if you are taking prescription drugs.'],
        ['Is guarana safe during pregnancy?', 'Caffeine intake should be limited during pregnancy. Consult your healthcare provider before use.']
      ]},
      { name: 'Storage and shelf life', qs: [
        ['How should I store Guarana Capsules?', 'Store in a cool, dry place away from direct sunlight. Keep the container tightly sealed.'],
        ['What is the shelf life?', 'Check the expiration date printed on the packaging.']
      ]},
      { name: 'Ordering and general questions', qs: [
        ['Can I stack Guarana with other Phenome supplements?', 'Yes, but be mindful of total caffeine intake if combining with other energy support supplements.'],
        ['Do Guarana Capsules diagnose or treat medical conditions?', 'No. This supplement is not intended to diagnose, treat, cure, or prevent any disease.'],
        ['What should I do if I feel overstimulated?', 'Stop taking the supplement and reduce caffeine intake. Seek medical advice if symptoms persist.']
      ]}
    ]
  });

  /* ======================================================================
     DEVICES
     ==================================================================== */
  T.push({
    id: 'devices', name: 'Devices', title: 'PhenomeTech Ring & Band',
    desc: 'Setting up, wearing, charging and understanding your device.',
    glyph: 'ring',
    groups: [
      { name: 'About the Ring & Band', qs: [
        ['What are Phenome Longevity wearables?', 'Phenome Longevity wearables are smart health devices designed to monitor biometric data such as sleep, activity, heart rate, recovery, and other wellness indicators. They integrate with the Phenome Longevity app to provide personalised insights.'],
        ['What do your wearables track?', 'Depending on the device, wearables may track:\n• Heart rate\n• Heart rate variability (HRV)\n• Sleep patterns\n• Activity levels\n• Recovery metrics\n• Body temperature trends\n• Movement and steps\n\nSpecific metrics vary by product.'],
        ['Are Phenome wearables medical devices?', 'No. Phenome Longevity wearables are wellness devices and are not classified as medical devices. They are not intended to diagnose, treat, cure, or prevent disease.'],
        ['How are Phenome wearables different from other fitness trackers?', 'Phenome wearables integrate directly with your:\n• Genomic insights\n• Microbiome data\n• Supplement protocols\n• Lifestyle recommendations\n\nThis allows for a more personalised, longevity focused approach rather than generic fitness tracking.']
      ]},
      { name: 'Wearing & charging', qs: [
        ['How should I wear my Phenome wearable?', 'Wear the device as instructed in the product guide, ensuring consistent skin contact for optimal readings.'],
        ['Can I wear it while sleeping?', 'Yes. Our wearables are designed for 24 hour wear, including sleep tracking.'],
        ['Is it safe to wear all day?', 'Yes. Our devices are designed for safe, continuous use under normal conditions.'],
        ['Is the wearable waterproof?', 'Water resistance depends on the specific model. Please check the product specifications before swimming or showering with the device.'],
        ['How long does the battery last?', 'Battery life depends on the device and usage intensity. Most devices require charging every week.'],
        ['How do I charge my wearable?', 'Use the charging cable or dock provided with your device.'],
        ['Can I overcharge the device?', 'No. Devices are designed with a built in charging protection system.']
      ]},
      { name: 'Accuracy & your data', qs: [
        ['How accurate are Phenome Longevity wearables?', 'Our devices use validated sensor technology to provide high quality wellness tracking. However, wearable data should be viewed as informative rather than diagnostic.'],
        ['Can wearable data replace medical testing?', 'No. Wearables provide trend based insights and are not suitable for laboratory testing or professional medical evaluation.'],
        ['Why might my wearable readings fluctuate?', 'Wearable data may vary due to:\n• Movement\n• Skin contact quality\n• Hydration levels\n• Environmental temperature\n• Device positioning\n\nConsistency in wearing improves data reliability.']
      ]},
      { name: 'App integration', qs: [
        ['How often does the wearable sync data?', 'Wearables sync automatically when connected to the Phenome Longevity app via Bluetooth and internet connection.'],
        ['Do I need the Phenome Longevity app to use the wearable?', 'Yes. The wearable pairs with the Phenome Longevity app to display and analyse your data.'],
        ['Can I connect my wearable to other apps?', 'Compatibility depends on the device model. Please refer to the product page for integration details.'],
        ['Can wearable data influence my personalised recommendations?', 'Yes. Wearable data may help refine insights within the app, especially related to:\n• Sleep optimisation\n• Recovery\n• Activity balance\n• Stress patterns']
      ]},
      { name: 'Safety & medical disclaimer', qs: [
        ['Can wearable data diagnose health conditions?', 'No. Wearable data is intended for informational purposes only and is not a substitute for professional medical advice.'],
        ['Should I consult a doctor based on wearable readings?', 'If your wearable data raises concerns, consult a qualified healthcare professional for proper evaluation.'],
        ['Are wearables safe for people with a medical device?', 'If you use a pacemaker or other implanted medical device, consult your healthcare provider before using a wearable device.']
      ]},
      { name: 'Warranty, returns & support', qs: [
        ['Do you offer warranties on wearables?', 'Yes. Warranty terms vary by device. Please refer to the product page or contact support for details.'],
        ['Can I return a wearable device?', 'Returns are subject to our return policy. Devices must typically be returned in original condition.'],
        ['What should I do if my wearable stops working?', 'Contact our support team and we will guide you through troubleshooting or replacement options.'],
        ['Who do I contact for technical support?', 'Email us at hello@phenomelongevity.com, we are happy to assist.']
      ]}
    ]
  });

  /* ======================================================================
     APP & RESULTS
     ==================================================================== */
  T.push({
    id: 'app', name: 'App & results', title: 'Your app and your data',
    desc: 'Getting into your account, reading your report and keeping your data private.',
    glyph: 'phone',
    groups: [
      { name: 'Account & access', qs: [
        ['What is the Phenome Longevity app?', 'The Phenome Longevity app is the secure platform where your personalised genomic test results are delivered. Once your sample has been processed, your full report becomes available inside the app for easy exploration.'],
        ['What can I do in the Phenome Longevity app?', 'Inside the app, you can:\n• View your genomic and microbiome results\n• Explore personalised health insights\n• Track progress over time\n• Download and share reports\n• Book optional consultations\n• Access educational health content'],
        ['Do I need the app to access my test results?', 'We recommend using the app for the best experience. However, you can also access your results via the secure Phenome Longevity web portal.'],
        ['What will I see in the app when my results are ready?', 'When your results are available, you’ll see:\n• A Genomic Profile at a Glance overview\n• Insights organised by key health categories\n• Personalised genetic trait summaries\n• Visual charts and clear explanations\n\nThis allows you to quickly identify which health areas may be most relevant to you.'],
        ['How are my genomic results organised in the app?', 'Your results are grouped into health categories such as:\n• Heart health\n• Metabolism\n• Brain function\n• Immunity\n• Nutrient response\n\nThis structured layout makes it easy to explore your insights step by step.'],
        ['Can I view detailed information about specific genes?', 'Yes. The app includes a Variant by Variant View, where each gene is listed with:\n• The specific variant\n• Its classification\n• Associated traits\n• Scientific context\n\nThis allows you to explore your results at a deeper level if desired.'],
        ['What do the scientific classifications mean?', 'Each variant is classified according to internationally recognised standards (such as pathogenic, likely benign, or benign). We explain these terms in clear language so you understand what they mean for you.'],
        ['How does the app personalise my insights?', 'The app highlights how your genetic variants may influence traits such as sleep patterns, inflammation response, nutrient metabolism, and exercise recovery. This helps you understand how your genetic profile may relate to your lifestyle.'],
        ['Is the Phenome Longevity app secure?', 'Yes. Your data is encrypted, stored securely, and protected in compliance with data protection laws. We never share your data without your explicit consent.'],
        ['Do I need to download the app?', 'We recommend downloading the app for the best experience. You can scan the QR code in your kit or search for “Phenome Longevity” in your app store.'],
        ['Can I access my results without using the app?', 'Yes. You can also access your results securely via the Phenome Longevity online portal using a web browser.'],
        ['Is the app free to download?', 'Yes. The Phenome Longevity app is free to download.'],
        ['How do I create an account?', 'You can create an account during kit registration, through the app directly, or via the Phenome portal website. You’ll need a valid email address to get started.'],
        ['I forgot my password. What should I do?', 'Use the “Forgot Password” option on the login screen to reset your password securely.'],
        ['Can I use the same account for multiple tests?', 'Yes. All your purchased tests and results will be stored under one secure account.'],
        ['Can I have multiple profiles under one account?', 'Each individual must have their own registered account to ensure privacy and data protection.'],
        ['How do I reset my password for my Phenome Longevity account?', 'To reset your password, click on the “Forgot my password” link on the login page.']
      ]},
      { name: 'Reading your results', qs: [
        ['When will my genomic test results be ready?', 'Results are typically available within approximately three weeks after your saliva sample arrives at our laboratory. You’ll receive an email or app notification when your report is ready.'],
        ['What does my genomic report include?', 'Your report includes genetic trait insights, nutrient metabolism markers, predisposition indicators, personalised wellness recommendations, and clear explanations in accessible language. The goal is to provide actionable, educational insights.'],
        ['Is there a subscription required to use the app?', 'No subscription is required to access your purchased test results.'],
        ['Are consultations included in the test price?', 'Consultations may be offered as optional paid services.'],
        ['Can this test diagnose diseases?', 'No. Phenome Longevity tests are not diagnostic tools. They provide genetic insights and risk indicators but do not diagnose, treat, cure, or prevent disease.'],
        ['What is genetic counselling?', 'Genetic counselling is an optional support service that helps you understand your genetic results. A trained professional explains your findings in personalised, straightforward terms.'],
        ['How can genetic counselling help me?', 'A counsellor can explain inheritance patterns, clarify complex variants, discuss lifestyle implications, help you interpret risk indicators, and guide you on next steps. This service is designed to provide clarity and reassurance.'],
        ['Does genetic counselling provide medical treatment?', 'No. Genetic counselling does not replace medical care. It provides interpretation and education. Always consult a healthcare professional for medical advice.'],
        ['How do I book genetic counselling?', 'You can book a session through the Phenome Longevity app.'],
        ['What should I do after receiving my results?', 'Take time to review your report carefully. If needed:\n• Book a genetic counselling session\n• Discuss findings with your doctor\n• Consider lifestyle or nutrition adjustments\n\nYour report is designed to empower informed decision making.'],
        ['How will I know when my results are ready?', 'You will receive an email notification and/or an in app notification once your results are available.'],
        ['How are my results displayed in the app?', 'Your results are organised by:\n• Health category\n• Genetic trait\n• Microbiome balance\n• Performance indicators\n\nEach section includes visual summaries and detailed explanations.'],
        ['Can I download my reports?', 'Yes. You can download your reports as a PDF and share them with healthcare professionals or family members.'],
        ['Can I track changes over time?', 'For microbiome and repeat tests, you can compare results across different time points to monitor changes.'],
        ['Does the app provide personalised recommendations?', 'Yes. Based on your results, the app provides educational guidance and lifestyle considerations tailored to your profile.'],
        ['Does the app recommend supplements?', 'The app may highlight supplements aligned with your insights, but these are optional and not medical prescriptions.'],
        ['Is the Phenome Longevity app intended to diagnose disease?', 'No. The app and associated tests provide informational insights and are not intended to diagnose, treat, cure, or prevent disease.'],
        ['Should I consult a doctor before acting on my results?', 'Yes. Always consult a qualified healthcare professional before making significant health or lifestyle changes.']
      ]},
      { name: 'Consultations & support', qs: [
        ['Can I book a consultation through the app?', 'Yes. You can book optional sessions with a genetic counsellor or health expert directly within the app.'],
        ['What is genetic counselling in the app?', 'Genetic counselling is an optional service that helps you interpret your results with professional guidance.'],
        ['Does the app provide medical advice?', 'No. The app provides educational insights only. It does not replace medical diagnosis or treatment.'],
        ['How do I contact support?', 'You can contact us at hello@phenomelongevity.com. We are happy to assist with any questions.']
      ]},
      { name: 'Data privacy & security', qs: [
        ['Are my genetic data and personal information secure?', 'Yes. We use secure systems and follow strict data protection regulations. Your sample is processed using a unique kit ID to protect your identity.'],
        ['Do you share or sell my genetic data?', 'No. We do not sell or share your personal or genetic data without your explicit consent.'],
        ['Can I share my results with my doctor or family?', 'Yes. You can download your report and share it with healthcare professionals or family members if you choose.'],
        ['Is my data secure in the Phenome Longevity app?', 'Yes. We use encrypted systems and secure data storage practices in compliance with UK and EU data protection regulations.'],
        ['Do you sell my data?', 'No. We do not sell or share your genetic or health data without your explicit consent.'],
        ['How is my DNA linked to my account?', 'Each sample is processed using a unique Kit ID. This ensures accurate matching while protecting your identity.'],
        ['Can I delete my account?', 'Yes. You may request account deletion by contacting our support team.'],
        ['Is my wearable data secure?', 'Yes. Data is encrypted and stored securely within the Phenome Longevity ecosystem in compliance with data protection regulations.'],
        ['Do you sell wearable data?', 'No. We do not sell or share your personal health data without your explicit consent.'],
        ['Can I delete my wearable data?', 'Yes. You may request deletion of your data by contacting support.']
      ]},
      { name: 'Technical help', qs: [
        ['Which devices support the Phenome Longevity app?', 'The app is available on:\n• iOS devices\n• Android devices\n\nPlease check your device’s app store for compatibility requirements.'],
        ['Why isn’t my app loading properly?', 'Try:\n• Restarting the app\n• Updating to the latest version\n• Restarting your device\n\nIf the issue persists, contact support.'],
        ['Do I need internet access to use the app?', 'Yes. An internet connection is required to access results and sync updates.']
      ]}
    ]
  });

  /* ======================================================================
     ORDERS & DELIVERY
     ==================================================================== */
  T.push({
    id: 'orders', name: 'Orders & delivery', title: 'Orders, shipping and refunds',
    desc: 'Placing an order, tracking it, and what happens if something goes wrong.',
    glyph: 'box',
    groups: [
      { name: 'Ordering & payment', qs: [
        ['How do I place an order on the Phenome Longevity website?', 'Simply visit our website, choose your test, select add ons, and follow the checkout process.'],
        ['What payment methods do you accept?', 'We accept credit and debit cards, PayPal, Apple Pay, and other secure payment methods.'],
        ['Can I track my order after purchasing a test?', 'Yes, tracking details will be provided via email once your kit is shipped.'],
        ['Who do I contact if I have issues with my order?', 'If you experience any issues with your order, please reach out to us at hello@phenomelongevity.com.']
      ]},
      { name: 'Shipping & delivery', qs: [
        ['Do you ship internationally?', 'We ship within the UK and to selected countries.\n\nReturn postage is included for UK customers. International return policies may vary.'],
        ['Are there geographical shipping restrictions?', 'We ship within the United Kingdom and selected countries. UK kits include prepaid return postage. International shipping and returns may vary.'],
        ['What should I do if I didn’t receive my test kit?', 'Contact our support team for assistance with reshipping your kit.'],
        ['Do you offer international shipping?', 'No, we currently only ship within the UK.'],
        ['What happens if a test kit is lost during shipment?', 'If a test kit is lost in transit, we will send a replacement free of charge.'],
        ['What if my kit hasn’t arrived?', 'Please contact us and we will resend it promptly.'],
        ['What if the kit is missing items?', 'We will send replacements right away.'],
        ['What if my kit is missing items or damaged?', 'Contact us immediately and we will send replacement parts or a new kit at no additional cost.']
      ]},
      { name: 'Returns & refunds', qs: [
        ['Can I cancel or refund my order?', 'Unused and sealed kits can be refunded. Once a sample has been collected, the kit is no longer eligible for a refund.'],
        ['Can I request a refund?', 'Refunds are available if:\n• The kit is unused and returned sealed\n• There is a manufacturing defect\n\nOnce a biological sample has been processed, refunds are not possible.'],
        ['Can I cancel my order?', 'You may cancel your order before shipment for a full refund. After shipping, refunds are possible only if the kit is unused and returned sealed.'],
        ['What is your refund or cancellation policy?', 'Refunds are available if the kit is unused and returned within 14 days.']
      ]}
    ]
  });

  /* ======================================================================
     ABOUT PHENOME
     ==================================================================== */
  T.push({
    id: 'about', name: 'About Phenome', title: 'About Phenome Longevity',
    desc: 'Who we are, the science we use and how we handle your data.',
    glyph: 'helix',
    groups: [
      { name: 'About us', qs: [
        ['What makes Phenome Longevity different from other testing companies?', 'Comprehensive, actionable reports tailored to your health goals. Partnerships with top research institutions for scientific credibility. Expert consultations and nutritionists available.'],
        ['Do you offer educational resources on gut health, longevity, and genetics?', 'Yes! We provide expert content on gut health, genetics, longevity, and wellness through our articles, app, and newsletters.'],
        ['Who are the experts behind Phenome Longevity?', 'Please refer to our “About” page for our experts.']
      ]},
      { name: 'Our science & research', qs: [
        ['What research backs up Phenome Longevity’s testing methods?', 'Our testing methods are backed by peer reviewed research. Please refer to the publications in the “Resources” page on our website.'],
        ['Do you collaborate with researchers or universities?', 'Yes, we collaborate with KTH Royal Institute of Technology and King’s College London.']
      ]},
      { name: 'How we handle your data', qs: [
        ['How is my privacy protected with genetic testing?', 'We use end to end encryption and GDPR compliant data security to protect your genetic information.']
      ]}
    ]
  });

  /* ======================================================================
     PARTNER WITH US
     ==================================================================== */
  T.push({
    id: 'partner', name: 'Partners', title: 'Partner with us',
    desc: 'For practitioners, clinics, affiliates and research collaborators.',
    glyph: 'hands',
    groups: [
      { name: 'Practitioners & clinics', qs: [
        ['Do you offer partnerships for healthcare professionals and wellness brands?', 'Yes! We collaborate with hospitals, pharmacies, clinics, wellness brands, and researchers who want to integrate our testing into their practice.'],
        ['Can I sell Phenome Longevity tests in my clinic or practice?', 'Yes, you can. For more information on how to offer our tests in your practice, please contact hello@phenomelongevity.com.'],
        ['How do I sign up as a partner?', 'To become a partner, please contact hello@phenomelongevity.com.'],
        ['Do you offer wholesale pricing for businesses?', 'Yes, exclusive pricing is available for clinics, hospitals, pharmacies, and businesses.']
      ]},
      { name: 'Affiliates & ambassadors', qs: [
        ['How can I become an affiliate or ambassador for Phenome Longevity?', 'Get in touch with hello@phenomelongevity.com.']
      ]}
    ]
  });

  /* ---- popular right now: the source's own five ----------------------- */
  var POPULAR = [
    ['How do I activate my test kit?', 'Register the Kit ID in the app before you post your sample. A sample from an unactivated kit cannot be matched to you.', 'tests'],
    ['How long will my results take?', 'Two to four weeks from the lab receiving your sample, depending on the test.', 'tests'],
    ['Do you ship internationally?', 'No, we only ship within the UK.', 'orders'],
    ['Can I request a refund?', 'Refunds are available on unused, unopened kits. Once a kit is activated or a sample is processed it cannot be refunded.', 'orders'],
    ['How do I get my results?', 'Everything is delivered in the Phenome Longevity app. You will get an email the moment your report is ready.', 'app']
  ];

  return { topics: T, popular: POPULAR };
})();
