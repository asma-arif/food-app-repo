import React, { useState } from 'react';

export default function App() {
  const [lang, setLang] = useState('en'); // 'en' or 'bn'
  const [isGenerating, setIsGenerating] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [profile, setProfile] = useState({
    gender: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    customGoal: '',
    activity: '',
    customActivity: '',
    lifestyle: '',
    customLifestyle: '',
    healthCondition: '',
    customHealthCondition: '',
    dietaryPref: '',
    customDietaryPref: '',
    cyclePhase: '',
    customCyclePhase: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user changes inputs
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if critical fields are left unselected
    const isGenderEmpty = !profile.gender;
    const isMetricsEmpty = !profile.age || !profile.weight || !profile.height;
    const isGoalEmpty = !profile.goal || (profile.goal.includes('Custom') && !profile.customGoal);
    const isActivityEmpty = !profile.activity || (profile.activity.includes('Custom') && !profile.customActivity);
    const isLifestyleEmpty = !profile.lifestyle || (profile.lifestyle.includes('Custom') && !profile.customLifestyle);
    const isHealthEmpty = !profile.healthCondition || (profile.healthCondition.includes('Custom') && !profile.customHealthCondition);
    const isDietEmpty = !profile.dietaryPref || (profile.dietaryPref.includes('Custom') && !profile.customDietaryPref);

    if (isGenderEmpty || isMetricsEmpty || isGoalEmpty || isActivityEmpty || isLifestyleEmpty || isHealthEmpty || isDietEmpty) {
      setValidationError(
        lang === 'bn'
          ? '⚠️ অনুগ্রহ করে এআই প্ল্যান তৈরি করার আগে সবগুলো অপশন সঠিকভা‌বে নির্বাচন বা টাইপ করুন।'
          : '⚠️ Please select or fill in all required profile options before generating your AI plan.'
      );
      return;
    }

    setValidationError('');
    setIsGenerating(true);

    // Multi-stage AI loading animation steps
    setProcessingStep(lang === 'bn' ? '১/৩: শারীরিক বায়ো-মেট্রিক্স বিশ্লেষণ করা হচ্ছে...' : '1/3: Analyzing biological metrics & parameters...');

    setTimeout(() => {
      setProcessingStep(lang === 'bn' ? '২/৩: স্থানিয় খাবারের তালিকা ফিল্টার করা হচ্ছে...' : '2/3: Filtering local produce & dietary constraints...');
    }, 400);

    setTimeout(() => {
      setProcessingStep(lang === 'bn' ? '৩/৩: ক্লিনিক্যাল সেফটি গার্ডরেল প্রয়োগ করা হচ্ছে...' : '3/3: Applying clinical safety guardrails...');
    }, 800);

    setTimeout(() => {
      setIsGenerating(false);
      setHasSubmitted(true);
      // Smooth scroll to output panel for responsive screen sizes
      const outputEl = document.getElementById('ai-output-panel');
      if (outputEl) {
        outputEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  };

  const calculateMetrics = () => {
    const numAge = Number(profile.age) || 21;
    const numWeight = Number(profile.weight) || 65;

    let baseCalories = 2000 + (numWeight * 12) - (numAge * 5);
    let baseProtein = Math.round(numWeight * 1.6);
    let baseCarbs = 220;

    if (profile.goal && (profile.goal.includes('Lose weight') || profile.goal.includes('Fat Loss'))) {
      baseCalories -= 450;
      baseProtein += 15;
      baseCarbs -= 60;
    } else if (profile.goal && (profile.goal.includes('Athletic') || profile.goal.includes('Muscle') || profile.goal.includes('Bulking'))) {
      baseCalories += 350;
      baseProtein += 30;
      baseCarbs += 40;
    }

    if (profile.activity && (profile.activity.includes('Football') || profile.activity.includes('Sports') || profile.activity.includes('CrossFit'))) {
      baseCalories += 300;
      baseCarbs += 40;
    } else if (profile.activity && profile.activity.includes('Sedentary')) {
      baseCalories -= 250;
      baseCarbs -= 40;
    }

    const waterLiters = (numWeight * 0.035).toFixed(1);

    return {
      calories: Math.max(1200, Math.round(baseCalories)),
      protein: Math.max(50, baseProtein),
      carbs: Math.max(50, baseCarbs),
      fats: Math.max(40, Math.round((baseCalories * 0.28) / 9)),
      water: isNaN(waterLiters) || numWeight === 0 ? '0.0' : waterLiters
    };
  };

  const metrics = calculateMetrics();

  const getDynamicInsights = () => {
    let requiredFoods = [];
    let avoidList = [];
    let coreAdvice = [];

    const isBn = lang === 'bn';

    const health = profile.healthCondition === 'Custom / Other Condition (Type below)' ? profile.customHealthCondition : profile.healthCondition;

    if (health.toLowerCase().includes('diabetes')) {
      requiredFoods.push(
        isBn ? 'লাল চাল (Red Rice) & লাল আটার রুটি' : 'Fiber-rich Red Rice & Whole Wheat Roti',
        isBn ? 'মসুর ডাল (Red Lentils) & ছোলা' : 'Red Lentils (Dal) & Chickpeas',
        isBn ? 'সবুজ শাকসবজি (পালং শাক, লাউ, পেঁপে)' : 'Leafy Greens (Spinach, Bottle Gourd, Papaya)',
        isBn ? 'দেশি ডিম & সিদ্ধ মুরগির মাংস' : 'Boiled Eggs & Lean Chicken'
      );
      avoidList.push(
        isBn ? 'সাদা ভাত & ময়দার তৈরি খাবার' : 'Refined White Rice & White Flour Items',
        isBn ? 'চিনিযুক্ত জুস, কোল্ড ড্রিংকস ও মিষ্টি' : 'Sugary Drinks, Sodas & Desserts',
        isBn ? 'প্রসেসড ফাস্টফুড ও প্যাকেটজাত স্ন্যাকস' : 'Processed Fast Foods & High Glycemic Snacks'
      );
      coreAdvice.push(
        isBn ? '⚠️ ডায়াবেটিস প্রোটোকল: কার্বোহাইড্রেটের পরিমাণ কমানো হয়েছে এবং রক্তে গ্লুকোজের হঠাৎ বৃদ্ধি রোধ করতে ফাইবার যুক্ত ডাল ও শাকসবজি বাড়ানো হয়েছে।'
             : '⚠️ Glycemic Guardrail: Refined carbs restricted by 30%. Replaced with fiber-dense legumes and greens to blunt blood sugar spikes.'
      );
    } else if (health.toLowerCase().includes('pressure') || health.toLowerCase().includes('hypertension')) {
      requiredFoods.push(
        isBn ? 'কলা ও পটাশিয়াম যুক্ত ফলমূল' : 'Potassium-dense Bananas & Seasonal Fruits',
        isBn ? 'ডাবের পানি & শসা' : 'Fresh Green Coconut Water & Cucumber',
        isBn ? 'তাজা দেশি মাছ & চর্বিহীন প্রোটিন' : 'Fresh Local Fish & Lean Protein'
      );
      avoidList.push(
        isBn ? 'কাঁচা লবণ বা অতিরিক্ত সোডিয়াম যুক্ত খাবার' : 'Added Table Salt & High-Sodium Condiments',
        isBn ? 'প্রসেসড চিপস, নুডুলস ও আচার' : 'Processed Chips, Instant Noodles & Salty Pickles',
        isBn ? 'অতিরিক্ত ক্যাফেইন বা এনার্জি ড্রিংকস' : 'Excessive Caffeine & Commercial Energy Drinks'
      );
      coreAdvice.push(
        isBn ? '⚠️ ব্লাড প্রেসার প্রোটোকল: সোডিয়াম গ্রহণ সীমিত রাখা হয়েছে এবং রক্তচাপ নিয়ন্ত্রণে পটাশিয়াম সমৃদ্ধ খাবার যুক্ত করা হয়েছে।'
             : '⚠️ Vascular Guardrail: Sodium capped to maintain arterial health. Potassium-dense produce emphasized.'
      );
    } else {
      requiredFoods.push(
        isBn ? 'সম্পূর্ণ শস্যজাতীয় খাবার (Whole Grains)' : 'Whole Grain Complex Carbohydrates',
        isBn ? 'দেশি মুরগি, মাছ & ডিম' : 'Local Eggs, Poultry & Fish',
        isBn ? 'তাজা মসুমি ফলমূল & শাকসবজি' : 'Fresh Seasonal Produce & Vegetables'
      );
      avoidList.push(
        isBn ? 'অতিরিক্ত প্রসেসড বা ক্যানড খাবার' : 'Highly Processed / Preserved Foods',
        isBn ? 'অতিরিক্ত চিনিযুক্ত বেকারি আইটেম' : 'Refined Sugar & Commercial Bakery Items'
      );
      coreAdvice.push(
        isBn ? '✅ ব্যালেন্সড নিউট্রিশন: আপনার বয়স ও ওজনের সাথে সামঞ্জস্য রেখে প্রয়োজনীয় প্রোটিন, কার্ব ও ফ্যাটের সঠিক অনুপাত নিশ্চিত করা হয়েছে।'
             : '✅ Balanced Baseline: Macro distribution calibrated to sustain steady energy and metabolic homeostasis.'
      );
    }

    const act = profile.activity === 'Custom / Other Activity (Type below)' ? profile.customActivity : profile.activity;
    if (act.toLowerCase().includes('football') || act.toLowerCase().includes('sports') || act.toLowerCase().includes('gym')) {
      requiredFoods.push(
        isBn ? 'ওয়ার্কআউট/খেলার আগে কলা বা ওটস (Pre-workout Carbs)' : 'Pre-Activity Electrolytes & Easy Carbs (Banana/Oats)',
        isBn ? 'খেলার পরে ডিম, দুধ বা চিকেন (Post-match Protein)' : 'Post-Activity Protein Synthesis (Eggs/Dairy/Chicken)'
      );
      coreAdvice.push(
        isBn ? '⚽ হাই স্ট্যামিনা রিকভারি: খেলার বা ভারী এক্সারসাইজের ২ ঘণ্টা আগে কার্বোহাইড্রেট এবং পরে দ্রুত শোষণে সক্ষম প্রোটিন গ্রহণ করুন।'
             : '⚽ High-Performance Athletic Sync: Glycogen stores refueled pre-match; bio-available protein targeted post-workout.'
      );
    }

    if (profile.gender === 'Female') {
      const cycle = profile.cyclePhase === 'Custom / Other Phase (Type below)' ? profile.customCyclePhase : profile.cyclePhase;
      if (cycle.toLowerCase().includes('menstruation')) {
        requiredFoods.push(
          isBn ? 'আয়রন সমৃদ্ধ খাবার (পালং শাক, কলিজা, ডালিম)' : 'Iron Bioavailability (Spinach, Pomegranate, Lean Meat)',
          isBn ? 'ভিটামিন-সি যুক্ত দেশি লেবু/আমড়া' : 'Vitamin-C Co-factors (Fresh Lemon/Citrus)'
        );
        coreAdvice.push(
          isBn ? '🌸 পিরিয়ড কেয়ার প্রোটোকল: আয়রন শোষণ বাড়ানোর জন্য আয়রনযুক্ত খাবারের সাথে লেবুর রস বা ভিটামিন-সি যুক্ত করুন।'
               : '🌸 Hormonal Cycle Recovery: Non-heme iron sources paired with Vitamin C to restore oxygenation and combat fatigue.'
        );
      }
    }

    return { requiredFoods, avoidList, coreAdvice };
  };

  const insights = getDynamicInsights();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '36px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 36px auto', borderBottom: '1px solid #334155', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Personalized AI Nutrition Coach
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0' }}>
            {lang === 'bn' 
              ? 'আপনার বডি মেট্রিক্স, হেলথ কন্ডিশন ও লাইফস্টাইলের ওপর ভিত্তি করে রিয়েল-টাইম এআই নিউট্রিশন অ্যাডভাইস।' 
              : 'Tailoring meals, shopping lists, and clinical guardrails live to your exact body metrics and lifestyle.'}
          </p>
        </div>

        {/* Language Toggle */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', padding: '4px', display: 'flex', gap: '4px' }}>
          <button 
            type="button"
            onClick={() => setLang('en')} 
            style={{ 
              padding: '6px 14px', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: '700', 
              cursor: 'pointer',
              backgroundColor: lang === 'en' ? '#2563eb' : 'transparent',
              color: lang === 'en' ? '#ffffff' : '#94a3b8',
              border: 'none'
            }}
          >
            English
          </button>
          <button 
            type="button"
            onClick={() => setLang('bn')} 
            style={{ 
              padding: '6px 14px', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: '700', 
              cursor: 'pointer',
              backgroundColor: lang === 'bn' ? '#2563eb' : 'transparent',
              color: lang === 'bn' ? '#ffffff' : '#94a3b8',
              border: 'none'
            }}
          >
            বাংলা
          </button>
        </div>
      </div>

      {/* Main Container Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
        
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: '0 0 10px 0' }}>
            {lang === 'bn' ? '১. আপনার শারীরিক ও লাইফস্টাইল তথ্য' : '1. Body & Context Profile'}
          </h2>

          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', padding: '12px 14px', borderRadius: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
              💡 {lang === 'bn' ? 'উদাহরণসহ দিকনির্দেশনা (e.g. Guidance):' : 'e.g. Guidance & Examples:'}
            </span>
            <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '0', lineHeight: '1.5' }}>
              {lang === 'bn' 
                ? 'ফিল্ডগুলো নির্বাচন করে "Generate AI Nutrition Plan & Apply" বাটনে ক্লিক করুন।' 
                : 'Select options and click "Generate AI Nutrition Plan & Apply" to calculate targets.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Gender Select */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                {lang === 'bn' ? 'লিঙ্গ (Gender)' : 'Gender'}
              </label>
              <select name="gender" value={profile.gender} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #475569', fontSize: '14px', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: '500' }}>
                <option value="">-- Select Gender --</option>
                <option value="Female">Female / নারী</option>
                <option value="Male">Male / পুরুষ</option>
                <option value="Other">Other / অন্যান্য</option>
              </select>
            </div>

            {/* Age, Weight, Height */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {lang === 'bn' ? 'বয়স (e.g. 21)' : 'Age (e.g. 21)'}
                </label>
                <input type="number" name="age" min="1" max="120" placeholder="21" value={profile.age} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #475569', fontSize: '14px', backgroundColor: '#0f172a', color: '#ffffff' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {lang === 'bn' ? 'ওজন (e.g. 65)' : 'Weight (e.g. 65)'}
                </label>
                <input type="number" name="weight" min="1" max="300" placeholder="65" value={profile.weight} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #475569', fontSize: '14px', backgroundColor: '#0f172a', color: '#ffffff' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {lang === 'bn' ? 'উচ্চতা (e.g. 172)' : 'Height (e.g. 172)'}
                </label>
                <input type="number" name="height" min="1" max="250" placeholder="172" value={profile.height} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #475569', fontSize: '14px', backgroundColor: '#0f172a', color: '#ffffff' }} />
              </div>
            </div>

            {/* Goal Select */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                {lang === 'bn' ? 'প্রধান লক্ষ্য (Primary Goal)' : 'Primary Goal'}
              </label>
              <select name="goal" value={profile.goal} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #475569', fontSize: '14px', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: '500' }}>
                <option value="">-- Select Primary Goal --</option>
                <option>Athletic Performance & Muscle Recovery</option>
                <option>Weight management & Metabolic Health</option>
                <option>Aggressive Fat Loss / Calorie Deficit</option>
                <option>Clean Bulking & Muscle Gain</option>
                <option>Diabetes Management & Glycemic Control</option>
                <option>Hypertension & Cardiovascular Wellness</option>
                <option>Endurance Training & Marathon Prep</option>
                <option>Post-Injury Surgical / Physical Recovery</option>
                <option>PCOS / Hormonal Balance Optimization</option>
                <option>General Longevity & Cognitive Focus</option>
                <option>Custom / Other Goal (Type below)</option>
              </select>
              {profile.goal === 'Custom / Other Goal (Type below)' && (
                <input type="text" name="customGoal" placeholder={lang === 'bn' ? 'কাস্টম লক্ষ্য টাইপ করুন...' : 'Type custom goal...'} value={profile.customGoal} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #3b82f6', fontSize: '13px', backgroundColor: '#0f172a', color: '#ffffff' }} />
              )}
            </div>

            {/* Activity Select */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                {lang === 'bn' ? 'শারীরিক কর্মকাণ্ড (Activity)' : 'Physical Activity'}
              </label>
              <select name="activity" value={profile.activity} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #475569', fontSize: '14px', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: '500' }}>
                <option value="">-- Select Physical Activity --</option>
                <option>Competitive Football / High-Intensity Field Sports</option>
                <option>Cricket / Moderate Field Sports</option>
                <option>Daily Heavy Weightlifting / Gym Training</option>
                <option>High-Intensity Interval Training (HIIT) / CrossFit</option>
                <option>Endurance Distance Running & Cycling</option>
                <option>Swimming / Aquatic Workouts</option>
                <option>Light Daily Walking / Yoga Practice</option>
                <option>Sedentary / Minimal Physical Exercise</option>
                <option>Heavy Physical Manual Labor</option>
                <option>Martial Arts / Combat Sports</option>
                <option>Custom / Other Activity (Type below)</option>
              </select>
              {profile.activity === 'Custom / Other Activity (Type below)' && (
                <input type="text" name="customActivity" placeholder={lang === 'bn' ? 'কাস্টম কর্মকাণ্ড টাইপ করুন...' : 'Type custom activity...'} value={profile.customActivity} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #3b82f6', fontSize: '13px', backgroundColor: '#0f172a', color: '#ffffff' }} />
              )}
            </div>

            {/* Lifestyle Select */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                {lang === 'bn' ? 'লাইফস্টাইল (Lifestyle)' : 'Lifestyle'}
              </label>
              <select name="lifestyle" value={profile.lifestyle} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #475569', fontSize: '14px', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: '500' }}>
                <option value="">-- Select Lifestyle Routine --</option>
                <option>Student / Long Study & Screen Hours</option>
                <option>Corporate Desk Job / 9-to-5 Sedentary</option>
                <option>Night Shift / Irregular Sleep Schedule</option>
                <option>Frequent Field Traveler / Outdoor Work</option>
                <option>High Mental Stress & Fast-Paced Routine</option>
                <option>Early Riser / Morning Physical Routine</option>
                <option>Intermittent Fasting Follower (16/8 Routine)</option>
                <option>Stay-at-Home / Flexible Routine</option>
                <option>Post-Surgical Home Rest</option>
                <option>Frequent Social Dining / Business Lunches</option>
                <option>Custom / Other Lifestyle (Type below)</option>
              </select>
              {profile.lifestyle === 'Custom / Other Lifestyle (Type below)' && (
                <input type="text" name="customLifestyle" placeholder={lang === 'bn' ? 'কাস্টম লাইফস্টাইল টাইপ করুন...' : 'Type custom lifestyle...'} value={profile.customLifestyle} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #3b82f6', fontSize: '13px', backgroundColor: '#0f172a', color: '#ffffff' }} />
              )}
            </div>

            {/* Health Condition Select */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                {lang === 'bn' ? 'মেডিকেল কন্ডিশন (Health)' : 'Health Condition'}
              </label>
              <select name="healthCondition" value={profile.healthCondition} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #475569', fontSize: '14px', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: '500' }}>
                <option value="">-- Select Health Condition --</option>
                <option>Type 2 Diabetes (Carb-Aware / Glycemic Control)</option>
                <option>High Blood Pressure (Sodium & Vascular Restriction)</option>
                <option>None (Standard Healthy Baseline)</option>
                <option>Hyperuricemia / Gout (Purine Restriction)</option>
                <option>Chronic Kidney Disease (CKD - Protein & Electrolyte Limit)</option>
                <option>Fatty Liver Disease (NAFLD Focus)</option>
                <option>Hypothyroidism / Thyroid Metabolic Adjustment</option>
                <option>Polycystic Ovary Syndrome (PCOS / Insulin Resistance)</option>
                <option>GERD / Severe Acid Reflux (Spice & Acid Restriction)</option>
                <option>High Cholesterol / Cardiovascular Risk</option>
                <option>Custom / Other Condition (Type below)</option>
              </select>
              {profile.healthCondition === 'Custom / Other Condition (Type below)' && (
                <input type="text" name="customHealthCondition" placeholder={lang === 'bn' ? 'কাস্টম সমস্যা টাইপ করুন...' : 'Type custom condition...'} value={profile.customHealthCondition} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #3b82f6', fontSize: '13px', backgroundColor: '#0f172a', color: '#ffffff' }} />
              )}
            </div>

            {/* Dietary Preference Select */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                {lang === 'bn' ? 'খাবারের পছন্দ (Diet)' : 'Dietary Preference'}
              </label>
              <select name="dietaryPref" value={profile.dietaryPref} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #475569', fontSize: '14px', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: '500' }}>
                <option value="">-- Select Dietary Preference --</option>
                <option>Halal & Whole Foods (Local Produce)</option>
                <option>Lacto-Ovo Vegetarian (Dairy & Eggs Allowed)</option>
                <option>Strict Vegan (100% Plant-Based)</option>
                <option>Pescatarian (Fish & Seafood Inclusive)</option>
                <option>Gluten-Free & Celiac Compliant</option>
                <option>Lactose Intolerant / Dairy-Free</option>
                <option>Ketogenic / High-Fat Low-Carb</option>
                <option>Mediterranean Pattern Focus</option>
                <option>Nut Allergy / Allergen Restricted</option>
                <option>Low-FODMAP (IBS Sensitive Gut)</option>
                <option>Custom / Other Dietary Pattern (Type below)</option>
              </select>
              {profile.dietaryPref === 'Custom / Other Dietary Pattern (Type below)' && (
                <input type="text" name="customDietaryPref" placeholder={lang === 'bn' ? 'কাস্টম ডায়েট টাইপ করুন...' : 'Type custom dietary rule...'} value={profile.customDietaryPref} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #3b82f6', fontSize: '13px', backgroundColor: '#0f172a', color: '#ffffff' }} />
              )}
            </div>

            {/* Hormonal Phase */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                {lang === 'bn' ? 'হরমোনাল / পিরিয়ড ফেজ' : 'Hormonal Phase'}
              </label>
              {profile.gender === 'Female' ? (
                <>
                  <select name="cyclePhase" value={profile.cyclePhase} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #475569', fontSize: '14px', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: '500' }}>
                    <option value="">-- Select Cycle Phase --</option>
                    <option>Follicular Phase (Optimized Energy & High Insulin Sensitivity)</option>
                    <option>Ovulatory Phase (Peak Physical Strength)</option>
                    <option>Luteal Phase (PMS Support & Higher Calorie Baseline)</option>
                    <option>Menstruation (Iron & Energy Recovery Focus)</option>
                    <option>Post-Menopausal Metabolic Care</option>
                    <option>Pregnancy First Trimester Care</option>
                    <option>Lactation / Breastfeeding Support</option>
                    <option>Custom / Other Phase (Type below)</option>
                  </select>
                  {profile.cyclePhase === 'Custom / Other Phase (Type below)' && (
                    <input type="text" name="customCyclePhase" placeholder={lang === 'bn' ? 'কাস্টম হরমোনাল ফেজ...' : 'Type custom phase...'} value={profile.customCyclePhase} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #3b82f6', fontSize: '13px', backgroundColor: '#0f172a', color: '#ffffff' }} />
                  )}
                </>
              ) : (
                <div style={{ padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#64748b', fontSize: '13px' }}>
                  {lang === 'bn' ? 'N/A (পুরুষদের ক্ষেত্রে প্রযোজ্য নয়)' : 'N/A (Not Applicable for Males)'}
                </div>
              )}
            </div>

            {/* DYNAMIC VALIDATION ERROR MESSAGE BANNER */}
            {validationError && (
              <div style={{ backgroundColor: '#450a0a', border: '1px solid #f87171', color: '#fca5a5', padding: '12px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', lineHeight: '1.4' }}>
                {validationError}
              </div>
            )}

            {/* APPLY BUTTON */}
            <div style={{ marginTop: '6px' }}>
              <button
                type="submit"
                disabled={isGenerating}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isGenerating ? '#0284c7' : '#2563eb',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: isGenerating ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isGenerating ? (
                  <span>⚡ {lang === 'bn' ? 'এআই নিউট্রিশন প্ল্যান জেনারেট হচ্ছে...' : 'Generating AI Plan...'}</span>
                ) : (
                  <span>🚀 {lang === 'bn' ? 'এআই নিউট্রিশন প্ল্যান তৈরি করুন (Apply)' : 'Generate AI Nutrition Plan & Apply'}</span>
                )}
              </button>
            </div>

          </div>
        </form>

        {/* Right Column: Results Panel */}
        <div id="ai-output-panel" style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          {isGenerating ? (
            /* Live Processing Screen */
            <div style={{ padding: '40px 20px', textAlign: 'center', margin: 'auto' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚙️</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: '0 0 10px 0' }}>
                {lang === 'bn' ? 'এআই এলগরিদম রান হচ্ছে...' : 'Executing Nutrition AI Engine...'}
              </h3>
              <p style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '600', backgroundColor: '#0f172a', padding: '10px 14px', borderRadius: '8px', border: '1px solid #0284c7', display: 'inline-block' }}>
                {processingStep}
              </p>
            </div>
          ) : hasSubmitted ? (
            /* AI Recommendation Panel */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: '0' }}>
                  {lang === 'bn' ? '২. এআই রিয়েল-টাইম রেকমেন্ডেশন' : '2. Live AI Tailored Recommendation'}
                </h2>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#34d399', backgroundColor: '#064e3b', border: '1px solid #059669', padding: '4px 8px', borderRadius: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  ● {lang === 'bn' ? 'প্ল্যান এক্টিভ' : 'Plan Synced'}
                </span>
              </div>

              {/* Dynamic Macro & Hydration Grid */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  {lang === 'bn' ? 'দৈনিক লক্ষ্য ও পানি পান' : 'Daily Targets & Hydration'}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
                  <div style={{ backgroundColor: '#0f172a', padding: '10px 4px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>{metrics.calories}</div>
                    <div style={{ fontSize: '9px', fontWeight: '700', color: '#94a3b8', marginTop: '2px' }}>{lang === 'bn' ? 'ক্যালোরি' : 'CALORIES'}</div>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', padding: '10px 4px', borderRadius: '8px', border: '1px solid #500724' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#f43f5e' }}>{metrics.protein}g</div>
                    <div style={{ fontSize: '9px', fontWeight: '700', color: '#fda4af', marginTop: '2px' }}>{lang === 'bn' ? 'প্রোটিন' : 'PROTEIN'}</div>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', padding: '10px 4px', borderRadius: '8px', border: '1px solid #451a03' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#f59e0b' }}>{metrics.carbs}g</div>
                    <div style={{ fontSize: '9px', fontWeight: '700', color: '#fde68a', marginTop: '2px' }}>{lang === 'bn' ? 'কার্ব' : 'CARBS'}</div>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', padding: '10px 4px', borderRadius: '8px', border: '1px solid #1e3a8a' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#3b82f6' }}>{metrics.fats}g</div>
                    <div style={{ fontSize: '9px', fontWeight: '700', color: '#bfdbfe', marginTop: '2px' }}>{lang === 'bn' ? 'ফ্যাট' : 'FATS'}</div>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', padding: '10px 4px', borderRadius: '8px', border: '1px solid #065f46' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#34d399' }}>{metrics.water}L</div>
                    <div style={{ fontSize: '9px', fontWeight: '700', color: '#a7f3d0', marginTop: '2px' }}>{lang === 'bn' ? 'পানি' : 'WATER'}</div>
                  </div>
                </div>
              </div>

              {/* Shopping List */}
              <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#34d399', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  🛒 {lang === 'bn' ? 'জরুরি খাবারের বাজার তালিকা (কী কী লাগবে):' : 'Recommended Meal Essentials (What to Buy):'}
                </span>
                <ul style={{ margin: '0', paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  {insights.requiredFoods.map((food, idx) => (
                    <li key={idx}>{food}</li>
                  ))}
                </ul>
              </div>

              {/* Avoidance List */}
              <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #500724', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#f43f5e', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  🚫 {lang === 'bn' ? 'কঠোরভাবে বর্জনীয় (কী কী করা/খাওয়া উচিত নয়):' : 'Strict Avoidance Log (What NOT to Eat/Do):'}
                </span>
                <ul style={{ margin: '0', paddingLeft: '18px', fontSize: '12px', color: '#fda4af', lineHeight: '1.6' }}>
                  {insights.avoidList.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* AI Strategic Guidance */}
              <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  💡 {lang === 'bn' ? 'এআই স্ট্র্যাটেজিক পরামর্শ ও গার্ডরেল:' : 'Strategic AI Guidance & Clinical Guardrails:'}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {insights.coreAdvice.map((adv, idx) => (
                    <p key={idx} style={{ margin: '0', fontSize: '12px', color: '#e2e8f0', lineHeight: '1.5' }}>
                      {adv}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Initial Prompt Placeholder State */
            <div style={{ padding: '60px 20px', textAlign: 'center', margin: 'auto' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: '0 0 10px 0' }}>
                {lang === 'bn' ? 'প্রোফাইল নির্বাচন করুন' : 'Awaiting Profile Input'}
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0', lineHeight: '1.5' }}>
                {lang === 'bn'
                  ? 'বাম পাশের ফর্মের অপশনগুলো সিলেক্ট করে "Generate AI Nutrition Plan & Apply" বাটনে ক্লিক করলে আপনার নিউট্রিশন প্ল্যান জেনারেট হবে।'
                  : 'Select your parameters on the left form and click "Generate AI Nutrition Plan & Apply" to view your customized targets.'}
              </p>
            </div>
          )}

          <div style={{ paddingTop: '16px', borderTop: '1px solid #334155', fontSize: '10px', color: '#64748b', textAlign: 'center' }}>
            * {lang === 'bn' ? 'সাধারণ নিউট্রিশন তথ্য নির্দেশিকা। কোনো জটিল চিকিৎসার ক্ষেত্রে নিবন্ধিত চিকিৎসকের পরামর্শ নিন।' : 'General nutrition guidance only. Consult qualified medical specialists for clinical diagnosis.'}
          </div>

        </div>

      </div>
    </div>
  );
}