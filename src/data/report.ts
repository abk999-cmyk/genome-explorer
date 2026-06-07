import type { GenomeReport } from '../types/report'

/**
 * The LQT2 demonstration report, authored into the schema with verified,
 * layperson-friendly interpretations. Metadata was corrected against ClinVar /
 * gnomAD during research (see plan §9): ClinVar Variation ID 29777, GRCh38
 * coordinate chr7:150,951,552, exon "exon 9 (coding exon 7)". Educational only.
 */
export const report: GenomeReport = {
  schemaVersion: '1.0.0',

  meta: {
    reportType: 'Expanded Genome Screening',
    genomeBuild: 'GRCh38',
    specimen: 'Blood, peripheral',
    summaryStatement:
      'One pathogenic variant linked to Long QT Syndrome type 2 (KCNH2), three recessive carrier findings, and a panel of pharmacogenomic results. None of the screened risk-panel variants were detected.',
    coverageSummary:
      '97.6% of the genome sequenced to ≥15× depth; 90% of targeted positions at ≥20×. The KCNH2 finding sits in a region covered 100% at ≥20×.',
    methodology:
      'Whole-genome sequencing (2×150 bp paired-end) aligned to the GRCh38 assembly. Variants were classified per ACMG/AMP criteria (Richards et al., 2015); reportable findings are confirmed by an orthogonal method (e.g., Sanger).',
    stats: {
      genesAnalyzed: 20000,
      variantsReviewed: 4500000,
      findings: 13,
    },
  },

  /* ===================================================== MONOGENIC FINDING === */
  variants: [
    {
      id: 'kcnh2-a614v',
      gene: 'KCNH2',
      transcript: 'NM_000238.4',
      cdna: 'c.1841C>T',
      protein: 'p.Ala614Val',
      genomicHGVS: 'g.150951552G>A',
      locus: {
        chromosome: '7',
        start: 150951552,
        stop: 150951552,
        cytoband: '7q36.1',
        exon: 'exon 9 (coding exon 7)',
        strand: '-',
      },
      zygosity: 'Heterozygous',
      classification: 'Pathogenic',
      condition: 'Long QT Syndrome type 2 (LQT2)',
      inheritance: 'Autosomal Dominant',
      penetrance: {
        level: 'High but incomplete',
        note: 'Many carriers never develop symptoms — or even a prolonged QT on ECG.',
      },
      mechanism:
        'Dominant-negative reduction of the IKr potassium current carried by the heart’s Kv11.1 / hERG channel.',
      acmgCodes: [
        {
          code: 'PS3',
          strength: 'Strong',
          meaning:
            'Lab experiments prove harm — functional (patch-clamp) studies show this change reduces the IKr current.',
        },
        {
          code: 'PM1',
          strength: 'Moderate',
          meaning:
            'Lands in a mutational hot-spot — the channel’s pore-forming region, where changes are especially likely to be damaging.',
        },
        {
          code: 'PM2_Supporting',
          strength: 'Supporting',
          meaning:
            'Absent from large population databases (gnomAD) — consistent with a disease-causing role.',
        },
        {
          code: 'PP1_Strong',
          strength: 'Strong',
          meaning:
            'Tracks with disease across affected family members (co-segregation), upgraded by the number of relatives.',
        },
        {
          code: 'PP3',
          strength: 'Supporting',
          meaning:
            'Computational predictors agree the change is likely damaging.',
        },
      ],
      severityTier: 'critical',
      plain: {
        headline:
          'You carry one gene change that can make your heart’s electrical “reset” run slow — which raises the risk of dangerous fast rhythms in some people. Very manageable once it’s known.',
        explainer:
          'The KCNH2 gene builds the Kv11.1 (hERG) potassium channel. Four copies snap together into one pore that lets potassium flow out of heart cells to end each heartbeat — the “IKr” current that recharges the cell for the next beat. Your variant swaps one amino acid (alanine → valine) right in the pore. Because the channel is a four-piece team, one faulty piece can sabotage the whole assembly — a “dominant-negative” effect — so the current drops by more than half. Weaker IKr means slower recovery, which shows up as a longer QT interval on an ECG.',
        analogy:
          'Picture each heartbeat as draining and recharging a battery. The hERG channels are the fast-drain release valve that powers the cell down so it’s ready to fire again. The valve is built from four interlocking puzzle pieces — and one of yours is the wrong shape. It doesn’t just remove a quarter of the valve; the bad piece jams the whole thing, so the cell resets too slowly.',
        whatToDo:
          'Not an emergency, but worth a referral to a cardiology / inherited-arrhythmia clinic for a baseline ECG and risk assessment. Avoid QT-prolonging drugs, keep potassium and magnesium replete, and discuss whether a beta-blocker is right for you. First-degree relatives can be offered cascade testing.',
        caveat:
          'Incomplete penetrance: carrying the variant does not mean you’ll have symptoms — many carriers never do. The “50%” figure is the chance a child, sibling, or parent inherits the variant, not the chance of being ill. This screening result must be clinically confirmed.',
      },
      triggers: [
        'Sudden loud noises (alarm clocks, doorbells, ringing phones)',
        'Startle and strong emotion',
        'The postpartum period (for women)',
      ],
      management: [
        'Beta-blocker therapy (the mainstay)',
        'Strictly avoid QT-prolonging medications',
        'Keep potassium & magnesium replete',
        'Activity and exercise counseling',
        'An implantable defibrillator (ICD) only for genuinely high-risk individuals',
        'Cascade screening of first-degree relatives',
      ],
      familialRisk: {
        relativeRisk: '50%',
        note: 'Each first-degree relative has a 50% chance of inheriting the variant — not a 50% chance of being symptomatic.',
      },
      prevalence:
        'Congenital LQTS overall affects ~1 in 2,000; LQT2 is one of the most common subtypes.',
      external: {
        clinVarId: '29777',
        clinVarUrl: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/29777/',
        gnomad: 'Absent (0 of >250,000 alleles, gnomAD v4)',
        pmids: ['7889573', '16554806', '22895603'],
      },
    },
  ],

  /* ====================================================== CARRIER FINDINGS === */
  carrierVariants: [
    {
      id: 'ccdc40-carrier',
      gene: 'CCDC40',
      transcript: 'NM_017950.4',
      cdna: 'c.248delC',
      protein: 'p.Ala83ValfsX84',
      locus: {
        chromosome: '17',
        start: 80039966,
        stop: 80039966,
        cytoband: '17q25.3',
        exon: 'exon 3',
      },
      zygosity: 'Heterozygous',
      classification: 'Pathogenic',
      conditionCarried: 'Primary ciliary dyskinesia (PCD)',
      inheritance: 'Autosomal Recessive',
      mutationType: 'frameshift',
      geneFunction:
        'CCDC40 (with CCDC39) acts as a molecular “ruler” that positions the motor arms along cilia — the tiny hair-like oars that sweep mucus out of the airways and set the body’s left/right layout in the embryo.',
      acmgCodes: [
        {
          code: 'PVS1',
          strength: 'Very Strong',
          meaning:
            'A “null” change predicted to break the gene entirely (a frameshift → premature stop) in a gene where loss of function causes disease — the strongest pathogenic code.',
        },
        {
          code: 'PM3_VeryStrong',
          strength: 'Very Strong',
          meaning:
            'Repeatedly seen opposite another pathogenic variant in affected patients across many unrelated families.',
        },
        {
          code: 'PM2_Supporting',
          strength: 'Supporting',
          meaning: 'Very rare in population databases.',
        },
        {
          code: 'PP1',
          strength: 'Supporting',
          meaning: 'Co-segregates with disease in families.',
        },
      ],
      severityTier: 'carrier',
      plain: {
        headline:
          'You’re a healthy carrier of one PCD gene change. It doesn’t affect your health — it only matters if a future partner also carries a PCD gene change.',
        explainer:
          'Primary ciliary dyskinesia is recessive: you’d need two broken copies (one from each parent) to be affected. You have one altered copy and one working copy, so your cilia work normally. The single c.248delC deletion shifts the gene’s reading frame and triggers an early stop, disabling just that one copy.',
        analogy:
          'Cilia are rowers in a boat; CCDC40 is the coxswain’s spacing chart that keeps every oar evenly placed. One faulty copy and your crew still rows fine — you’re just carrying a spare blueprint with a typo.',
        whatToDo:
          'Nothing for your own health. If you’re planning a family, a partner can be screened for PCD-gene variants; it only matters if you both carry variants in the same gene (then a 1-in-4 chance per pregnancy).',
        caveat:
          'PCD-overall prevalence is ~1 in 16,000; CCDC40 accounts for ~9% of PCD. Carrier frequency is population-dependent.',
      },
      carrierFrequency: '≈ 1 in 317–366',
      reproductiveRisk: '≈ 1 in 1,268–1,464 with a random partner',
    },
    {
      id: 'dnah11-carrier',
      gene: 'DNAH11',
      transcript: 'NM_001277115.2',
      cdna: 'c.12363C>G',
      protein: 'p.Tyr4121X',
      locus: {
        chromosome: '7',
        start: 21880869,
        stop: 21880869,
        cytoband: '7p15.3',
        exon: 'exon 75',
      },
      zygosity: 'Heterozygous',
      classification: 'Pathogenic',
      conditionCarried: 'Primary ciliary dyskinesia (PCD)',
      inheritance: 'Autosomal Recessive',
      mutationType: 'nonsense (premature stop)',
      geneFunction:
        'DNAH11 builds part of the outer dynein arm — the actual motor that powers each cilium’s beat. It accounts for ~6–9% of PCD.',
      acmgCodes: [
        {
          code: 'PVS1',
          strength: 'Very Strong',
          meaning:
            'A nonsense change creating a premature STOP — predicted to break the gene entirely.',
        },
        {
          code: 'PP1_Strong',
          strength: 'Strong',
          meaning: 'Strong co-segregation with disease across affected siblings.',
        },
        {
          code: 'PM3',
          strength: 'Moderate',
          meaning: 'Found opposite another pathogenic variant in affected patients.',
        },
        {
          code: 'PM2_Supporting',
          strength: 'Supporting',
          meaning: 'Very rare in population databases.',
        },
      ],
      severityTier: 'carrier',
      plain: {
        headline:
          'A second, separate healthy-carrier finding — in a different PCD gene. Still just carrier status; you are not affected.',
        explainer:
          'This c.12363C>G change turns one codon into a premature STOP, cutting the protein short on that one copy. Your other copy works, so your cilia beat normally. Crucially, this is a different gene from CCDC40 — and because PCD is recessive, carrying variants in two different PCD genes does NOT give you PCD (you’d need two hits in the same gene).',
        analogy:
          'If CCDC40 was the spacing chart, DNAH11 is the oar’s motor itself. One broken copy, and the motors still run on the good copy — no symptoms for you.',
        whatToDo:
          'Same as the other carrier finding — relevant only for family planning, and only if a partner carries a variant in this same gene.',
        caveat:
          'DNAH11-related PCD often shows normal-looking cilia under the microscope but an abnormal beat pattern — a reason it can be missed without genetic testing.',
      },
      carrierFrequency: '≈ 1 in 211–259',
      reproductiveRisk: '≈ 1 in 844–1,036 with a random partner',
    },
    {
      id: 'acadsb-carrier',
      gene: 'ACADSB',
      transcript: 'NM_001609.4',
      cdna: 'c.303+1G>A',
      locus: {
        chromosome: '10',
        start: 123037848,
        stop: 123037848,
        cytoband: '10q26.13',
        exon: 'intron 3 (canonical splice donor)',
      },
      zygosity: 'Heterozygous',
      classification: 'Pathogenic',
      conditionCarried:
        'Short/branched-chain acyl-CoA dehydrogenase (SBCAD) deficiency',
      inheritance: 'Autosomal Recessive',
      mutationType: 'canonical splice-donor change',
      geneFunction:
        'ACADSB makes the SBCAD enzyme, which helps break down the amino acid isoleucine for energy.',
      acmgCodes: [
        {
          code: 'PVS1',
          strength: 'Very Strong',
          meaning:
            'A canonical splice-site change predicted to scramble the protein — the strongest pathogenic code.',
        },
        {
          code: 'PM3_Supporting',
          strength: 'Supporting',
          meaning:
            'Limited evidence of being found opposite another pathogenic variant in patients.',
        },
      ],
      severityTier: 'carrier',
      plain: {
        headline:
          'Healthy carrier of a generally mild metabolic condition — usually no health impact even in people who are affected.',
        explainer:
          'The c.303+1G>A change hits the canonical splice site, so the cell can’t correctly “cut and paste” the gene’s pieces on that one copy. As a recessive carrier with one working copy, you’re unaffected. Even people with two affected copies are often completely asymptomatic — many are found only on newborn screening.',
        analogy:
          'SBCAD is one worker on a recycling line for a specific protein building block. You have a full backup worker on the good copy, so the line keeps running normally.',
        whatToDo:
          'No action for your own health; relevant only for family planning if a partner is also a carrier of an ACADSB variant.',
        caveat:
          'SBCAD deficiency has reduced penetrance and is often clinically silent. It is most common in Hmong populations.',
      },
      carrierFrequency: 'Unknown / population-dependent',
      reproductiveRisk: 'Unknown',
    },
  ],

  /* ===================================================== PHARMACOGENOMICS === */
  pharmacogenomics: [
    {
      id: 'pgx-cyp2c19',
      gene: 'CYP2C19',
      diplotype: '*1/*17',
      phenotype: 'Rapid metabolizer',
      enzymeFunction:
        'Activates some drugs and clears others; you carry a fast-acting *17 variant.',
      plain:
        'You process these drugs faster than average. Clopidogrel still works normally — the concern there is slow metabolizers, not fast. But some SSRIs and PPIs may run low and become less effective, so a prescriber might pick a higher dose or an alternative.',
      affectedDrugs: [
        {
          name: 'Clopidogrel',
          recommendation:
            'Activated normally — no change needed (the risk is for poor metabolizers). Note: *17 carries a mildly higher bleeding tendency.',
        },
        {
          name: 'Citalopram',
          recommendation:
            'May run sub-therapeutic; also a QT-prolonging drug — flag your LQT2.',
          qtRisk: true,
        },
        {
          name: 'Escitalopram',
          recommendation: 'May run low and is also QT-prolonging — double caution.',
          qtRisk: true,
        },
        { name: 'Omeprazole', recommendation: 'May be less effective (faster clearance).' },
        { name: 'Pantoprazole', recommendation: 'May be less effective.' },
        { name: 'Dexlansoprazole', recommendation: 'May be less effective.' },
        {
          name: 'Voriconazole',
          recommendation: 'May run sub-therapeutic; also QT-prolonging.',
          qtRisk: true,
        },
      ],
      actionability: 'moderate',
      highlight:
        'Rapid ≠ dangerous. For clopidogrel, rapid metabolizers activate the drug just fine — the watch-out is reduced SSRI / PPI levels.',
    },
    {
      id: 'pgx-warfarin',
      gene: 'Warfarin panel',
      diplotype: 'CYP2C9 *1/*1 · VKORC1 G/A · CYP4F2 *1/*3',
      phenotype: 'Increased warfarin sensitivity (intermediate)',
      enzymeFunction:
        'VKORC1 is warfarin’s target (vitamin-K recycling); CYP2C9 and CYP4F2 help process warfarin and vitamin K.',
      plain:
        'If you ever need warfarin, your genetics suggest a somewhat lower dose than average (mostly driven by VKORC1 G/A). Algorithm-guided dosing is recommended — these genes explain about half of dose variability.',
      affectedDrugs: [
        {
          name: 'Warfarin',
          recommendation:
            'Use genotype-guided (algorithm) dosing; likely lower than the average starting dose.',
        },
      ],
      actionability: 'high',
    },
    {
      id: 'pgx-cyp3a5',
      gene: 'CYP3A5',
      diplotype: '*3/*3',
      phenotype: 'Poor metabolizer',
      enzymeFunction: 'Metabolizes tacrolimus, a transplant immunosuppressant.',
      plain:
        'If you ever needed tacrolimus, you would get the standard starting dose.',
      highlight:
        'Counterintuitive: “poor metabolizer” here is the COMMON group that gets the NORMAL dose. It’s the fast “expressers” who clear the drug quickly and need higher doses — so “poor” does NOT mean “lower dose.”',
      affectedDrugs: [
        {
          name: 'Tacrolimus',
          recommendation:
            'Standard starting dose per CPIC (do not reduce based on the “poor metabolizer” label).',
        },
      ],
      actionability: 'moderate',
    },
    {
      id: 'pgx-tpmt',
      gene: 'TPMT',
      diplotype: '*1/*1',
      phenotype: 'Normal metabolizer',
      enzymeFunction: 'Breaks down thiopurine drugs.',
      plain:
        'Standard, full starting doses of thiopurines are expected — no increased toxicity from TPMT.',
      affectedDrugs: [
        { name: 'Azathioprine', recommendation: 'Standard dosing.' },
        { name: 'Mercaptopurine', recommendation: 'Standard dosing.' },
        { name: 'Thioguanine', recommendation: 'Standard dosing.' },
      ],
      actionability: 'informational',
    },
    {
      id: 'pgx-nudt15',
      gene: 'NUDT15',
      diplotype: 'Normal (c.415C/c.415C)',
      phenotype: 'Normal metabolizer',
      enzymeFunction: 'Detoxifies thiopurine metabolites, alongside TPMT.',
      plain:
        'Both TPMT and NUDT15 are normal — doubly reassuring for thiopurine drugs.',
      affectedDrugs: [
        { name: 'Azathioprine', recommendation: 'Standard dosing (works with TPMT).' },
        { name: 'Mercaptopurine', recommendation: 'Standard dosing.' },
      ],
      actionability: 'informational',
    },
    {
      id: 'pgx-cyp2c9',
      gene: 'CYP2C9',
      diplotype: '*1/*1',
      phenotype: 'Normal metabolizer (activity score 2)',
      enzymeFunction: 'A major drug-metabolizing enzyme.',
      plain:
        'Normal metabolism; standard dosing. (“Activity score 2” just means normal.)',
      affectedDrugs: [
        { name: 'Celecoxib', recommendation: 'Standard dosing.' },
        { name: 'Flurbiprofen', recommendation: 'Standard dosing.' },
        { name: 'Meloxicam', recommendation: 'Standard dosing.' },
        { name: 'Phenytoin', recommendation: 'Standard dosing.' },
        { name: 'Piroxicam', recommendation: 'Standard dosing.' },
        { name: 'Siponimod', recommendation: 'Standard dosing.' },
      ],
      actionability: 'informational',
    },
    {
      id: 'pgx-slco1b1',
      gene: 'SLCO1B1',
      diplotype: '*1A/*1A',
      phenotype: 'Normal function',
      enzymeFunction: 'A liver transporter (OATP1B1) that pulls statins into the liver.',
      plain:
        'Normal function — no increased risk of statin-related muscle pain. Reassuring.',
      affectedDrugs: [
        { name: 'Rosuvastatin', recommendation: 'Standard dosing; normal myopathy risk.' },
        { name: 'Simvastatin', recommendation: 'Standard dosing; normal myopathy risk.' },
        { name: 'Elagolix', recommendation: 'Standard dosing.' },
      ],
      actionability: 'informational',
    },
    {
      id: 'pgx-dpyd',
      gene: 'DPYD',
      diplotype: 'Wild type (activity score 2)',
      phenotype: 'Normal metabolizer',
      enzymeFunction: 'Breaks down fluoropyrimidine chemotherapy.',
      plain:
        'Normal — you are not at the rare, severe DPD-deficiency risk for 5-FU / capecitabine toxicity. Reassuring.',
      affectedDrugs: [
        { name: 'Capecitabine', recommendation: 'Standard dosing; not DPD-deficient.' },
        { name: 'Fluorouracil', recommendation: 'Standard dosing; not DPD-deficient.' },
      ],
      actionability: 'informational',
    },
    {
      id: 'pgx-ugt1a1',
      gene: 'UGT1A1',
      diplotype: '*1/*1',
      phenotype: 'Normal metabolizer',
      enzymeFunction: 'Clears irinotecan’s toxic metabolite (SN-38) and other drugs.',
      plain:
        'Normal — standard irinotecan handling; not at the *28/*6 increased-toxicity risk.',
      affectedDrugs: [
        { name: 'Irinotecan', recommendation: 'Standard dosing.' },
        { name: 'Belinostat', recommendation: 'Standard dosing.' },
        { name: 'Nilotinib', recommendation: 'Standard dosing.' },
        { name: 'Pazopanib', recommendation: 'Standard dosing.' },
        { name: 'Raltegravir', recommendation: 'Standard dosing.' },
      ],
      actionability: 'informational',
    },
  ],

  /* ===================================================== SCREENED NEGATIVE === */
  screenedNegative: {
    genesScreened: [
      {
        gene: 'APC',
        condition: 'Hereditary colorectal cancer (FAP)',
        meaning:
          'No FAP-type high-risk variant detected — you’re not at that hereditary polyposis risk.',
      },
      {
        gene: 'APOE',
        condition: 'Alzheimer’s risk (ε4 allele)',
        meaning:
          'The ε4 risk allele wasn’t flagged — one fewer genetic risk factor for late-onset Alzheimer’s.',
      },
      {
        gene: 'CHEK2',
        condition: 'Breast / colorectal / thyroid cancer risk',
        meaning: 'No CHEK2 moderate-risk variant detected.',
      },
      {
        gene: 'F2',
        condition: 'Venous blood clots (prothrombin)',
        meaning:
          'No prothrombin G20210A — not at that inherited clotting risk.',
      },
      {
        gene: 'F5',
        condition: 'Venous blood clots (Factor V Leiden)',
        meaning:
          'No Factor V Leiden — the most common inherited clotting variant is absent.',
      },
      {
        gene: 'HFE',
        condition: 'Hereditary hemochromatosis (iron overload)',
        meaning: 'No HFE risk genotype detected.',
      },
      {
        gene: 'LRRK2',
        condition: 'Parkinson’s disease',
        meaning:
          'No LRRK2 risk variant — one fewer genetic Parkinson’s risk factor.',
      },
      {
        gene: 'MUC5B',
        condition: 'Idiopathic pulmonary fibrosis',
        meaning: 'The MUC5B promoter risk variant wasn’t found.',
      },
      {
        gene: 'PNPLA3',
        condition: 'Fatty liver disease (NAFLD)',
        meaning: 'No high-risk PNPLA3 genotype.',
      },
      {
        gene: 'SERPINA1',
        condition: 'Alpha-1 antitrypsin deficiency',
        meaning: 'No deficiency (Z/S) alleles detected.',
      },
    ],
    limitations:
      '“Not found” means the specific known variants screened on this assay were absent — not a guarantee against these conditions. Other genes, untested variants, and lifestyle / environment still matter.',
  },

  /* ============================================================ QT SAFETY === */
  qtSafety: {
    intro:
      'Because of the KCNH2 / LQT2 finding, certain drugs that prolong the QT interval should be avoided — or used only with cardiology oversight and ECG monitoring. Tell every prescriber and pharmacist about your LQT2 status.',
    categories: [
      {
        category: 'Antibiotics',
        examples: [
          'Azithromycin',
          'Clarithromycin',
          'Erythromycin',
          'Ciprofloxacin',
          'Levofloxacin',
          'Moxifloxacin',
        ],
      },
      { category: 'Antifungals', examples: ['Fluconazole', 'Voriconazole'] },
      { category: 'Antiemetics', examples: ['Ondansetron', 'Domperidone'] },
      {
        category: 'Antipsychotics',
        examples: ['Haloperidol', 'Ziprasidone', 'Thioridazine', 'Pimozide', 'Quetiapine'],
      },
      {
        category: 'Antidepressants',
        examples: ['Citalopram', 'Escitalopram', 'Tricyclics (e.g. amitriptyline)'],
      },
      {
        category: 'Antiarrhythmics (highest risk)',
        examples: ['Sotalol', 'Dofetilide', 'Amiodarone', 'Quinidine', 'Procainamide', 'Ibutilide'],
      },
      { category: 'Other', examples: ['Methadone', 'Hydroxychloroquine'] },
    ],
    doubleFlagged: ['Citalopram', 'Escitalopram', 'Voriconazole'],
    resourceLabel: 'CredibleMeds — the authoritative, maintained QT-drug list',
    resourceUrl: 'https://crediblemeds.org',
  },

  /* ============================================================ GLOSSARY === */
  glossary: [
    {
      term: 'Chromosome & exon',
      definition:
        'Your DNA is packed into 23 pairs of chromosomes. Genes are split into coding chunks (exons) separated by non-coding stretches (introns).',
      analogy: 'Chapters (chromosomes) made of paragraphs (exons) with footnotes (introns) in between.',
    },
    {
      term: 'c. vs p. vs g.',
      definition:
        'Three ways to name a variant: g. = its address on the chromosome; c. = its position counted along the gene’s coding sequence; p. = the resulting amino-acid change in the protein.',
      analogy: 'g. is the GPS pin of a house; c. is “the 1,841st house on Main Street”; p. is “the family living there changed.”',
    },
    {
      term: 'Heterozygous vs homozygous',
      definition:
        'You carry two copies of most genes. Heterozygous = the copies differ (one variant, one normal). Homozygous = both copies are identical.',
    },
    {
      term: 'Dominant vs recessive',
      definition:
        'For dominant conditions (like LQT2) one altered copy can be enough. For recessive ones (the carrier findings) you need two altered copies to be affected.',
    },
    {
      term: 'Carrier',
      definition:
        'Someone with one altered copy of a recessive gene. Carriers are healthy; it matters only for family planning if a partner carries a variant in the same gene.',
    },
    {
      term: 'Penetrance',
      definition:
        'The chance that someone with a variant actually develops the trait. “Incomplete penetrance” means risk goes up but disease isn’t guaranteed.',
    },
    {
      term: 'gnomAD',
      definition:
        'A database of genetic variation from >250,000 people. If a serious variant is absent there, that supports (but doesn’t prove) it being disease-causing.',
    },
    {
      term: 'ClinVar',
      definition:
        'A public archive where labs submit variant interpretations. “Review stars” show how much agreement backs a classification. This variant is Pathogenic, ID 29777.',
    },
    {
      term: 'Coverage / 20×',
      definition:
        'How many times each DNA letter was independently read. “20×” means read 20 times — high confidence the call is real. It’s a quality metric of the test, not a health finding.',
    },
    {
      term: 'ACMG/AMP criteria',
      definition:
        'The standard scoring system for calling a variant pathogenic or benign. Each line of evidence (PS3, PM1, PVS1 …) has a strength; together they reach a verdict.',
    },
  ],

  /* ========================================================= DISCLAIMERS === */
  disclaimers: [
    'This is an educational visualization of a synthetic demonstration genome report — not medical advice, a diagnosis, or a clinical result. Always consult a qualified clinician or genetic counselor.',
    'Genetic findings must be confirmed in a clinical (CLIA/CAP-accredited) setting and interpreted alongside personal and family history.',
    '“Not detected” means the specific variants screened were absent — it does not rule out all genetic or non-genetic risk.',
    'Do not start, stop, or change any medication based on this report. Pharmacogenomic results guide — they do not replace — a prescriber’s judgment.',
    'Sequencing does not reliably detect every variant type (e.g. repeat expansions, large structural or copy-number changes); roughly 95–98% of the genome is covered.',
    'All data here is static and processed in your browser — nothing is uploaded.',
  ],
}
