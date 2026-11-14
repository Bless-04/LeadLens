import { PipeCheckAnswers, PipeAnalysisResult, PipeMaterial } from '../types/pipe';

/**
 * LeadLens Pipe Analysis Engine
 * 
 * Implements standard EPA (Environmental Protection Agency) and AWWA 
 * (American Water Works Association) Lead Service Line identification logic.
 * 
 * IMPORTANT SAFETY RULES:
 * 1. Physical inspection identifies pipe material, NOT dissolved lead in water.
 * 2. Visual inspection alone CANNOT declare water safe.
 * 3. Never fake sensor readings or AI confidence.
 */

/**
 * Core Rule Engine for Pipe Material Identification
 */
export function analyzePipe(answers: PipeCheckAnswers): PipeAnalysisResult {
  const isDemo = Boolean(answers.isDemo);
  const reasons: string[] = [];
  let material: PipeMaterial = 'unknown';
  let confidence: 'high' | 'medium' | 'low' = 'medium';

  const { exteriorColor, magnetSticks, scratchResult, homeBuiltBefore1986 } = answers;

  // 1. Evaluate Plastic / PVC
  if (
    exteriorColor === 'white_or_blue_plastic' ||
    scratchResult === 'white_colored_plastic'
  ) {
    material = 'plastic';
    confidence = 'high';
    reasons.push('Pipe appears to be non-metallic plastic, PVC, or PEX.');
    reasons.push('Plastic pipes do not rust or corrode with lead.');
  }
  // 2. Evaluate Galvanized Steel (Magnet sticks firmly)
  else if (magnetSticks === 'sticks') {
    material = 'galvanized_steel';
    confidence = 'high';
    reasons.push('A magnet sticks firmly to the pipe, which indicates an iron or steel alloy.');
    if (scratchResult === 'dull_grey_hard') {
      reasons.push('Scratching reveals a hard, dull metallic grey surface typical of galvanized steel.');
    }
    reasons.push('Galvanized steel is not lead, but older steel pipes can trap lead particles from old upstream city connections.');
  }
  // 3. Evaluate Lead vs Copper (Magnet does NOT stick)
  else if (magnetSticks === 'does_not_stick') {
    // If scratch reveals bright copper/penny
    if (scratchResult === 'copper_penny' || exteriorColor === 'copper_brown') {
      material = 'copper';
      confidence = scratchResult === 'copper_penny' ? 'high' : 'medium';
      reasons.push('Magnet does not stick and the scratch reveals a bright penny-colored copper shine.');
      if (homeBuiltBefore1986 === true) {
        reasons.push('Note: If installed before 1986, copper pipes may have joints connected with lead solder.');
      }
    }
    // If scratch reveals shiny silver & soft
    else if (scratchResult === 'shiny_silver') {
      material = 'lead';
      confidence = 'high';
      reasons.push('Magnet does not stick to the pipe.');
      reasons.push('Scratching the pipe reveals a soft, shiny silver metal underneath (like a five-cent nickel).');
      if (exteriorColor === 'dull_grey') {
        reasons.push('Exterior shows the characteristic dull, matte gray finish of aged lead.');
      }
    }
    // If exterior is dull grey but not scratched yet
    else if (exteriorColor === 'dull_grey' && scratchResult === 'not_tested') {
      material = 'lead';
      confidence = 'low';
      reasons.push('Dull grey exterior and non-magnetic behavior are common warning signs of lead.');
      reasons.push('A scratch test is strongly recommended to confirm.');
    }
    else {
      material = 'unknown';
      confidence = 'low';
      reasons.push('The magnet did not stick, but visual appearance does not clearly distinguish between lead and other non-magnetic metals.');
    }
  }
  // 4. Fallback when magnet wasn't tested
  else {
    if (scratchResult === 'shiny_silver') {
      material = 'lead';
      confidence = 'medium';
      reasons.push('Shiny silver soft scratch mark suggests lead, but a magnet test is needed to be certain it is not steel.');
    } else if (scratchResult === 'copper_penny') {
      material = 'copper';
      confidence = 'medium';
      reasons.push('Copper color observed under scratch.');
    } else {
      material = 'unknown';
      confidence = 'low';
      reasons.push('Insufficient physical test data to classify pipe safely.');
    }
  }

  // Construct Material specific profile
  switch (material) {
    case 'lead':
      return {
        material: 'lead',
        materialName: 'Likely Lead Pipe',
        riskLevel: 'high',
        confidence,
        title: 'High Likelihood of Lead Service Line',
        summary: 'Based on your physical check (non-magnetic, soft metal scratching shiny silver), this pipe exhibits the key characteristics of a lead water pipe.',
        reasons,
        disclaimer: 'CRITICAL SAFETY NOTE: This inspection checks the physical pipe material where water enters your home. Photos and scratch tests CANNOT measure lead dissolved in drinking water. Even if you replace this pipe, only an EPA-certified lab water test can guarantee your water quality.',
        immediateActions: [
          'Run your tap on cold for 2 to 3 minutes before drinking or cooking if the water has been sitting unused.',
          'Always use cold tap water for cooking, drinking, and preparing baby formula (warm water leaches more lead).',
          'Do not boil water to remove lead — boiling evaporates water and actually concentrates the lead.'
        ],
        confirmatorySteps: [
          'Get a free or certified low-cost drinking water test kit from your municipal water utility or local health department.',
          'Call your local water provider to inspect their utility inventory records (many cities maintain public lead maps).',
          'Have a licensed plumber inspect the water service line at the shut-off valve.'
        ],
        filterRecommendations: 'Use a water filter certified to NSF/ANSI Standard 53 or 58 specifically rated for lead reduction.',
        utilityNextSteps: 'Under the EPA Lead and Copper Rule Improvements (LCRI) and Bipartisan Infrastructure Law, many water utilities offer free or subsidized lead service line replacements.',
        isDemo
      };

    case 'copper':
      return {
        material: 'copper',
        materialName: 'Likely Copper Pipe',
        riskLevel: homeBuiltBefore1986 === true ? 'moderate' : 'low',
        confidence,
        title: 'Likely Copper Water Pipe',
        summary: 'Your test results (non-magnetic with a distinctive penny-copper sheen) indicate your service line is copper.',
        reasons,
        disclaimer: 'IMPORTANT: While copper pipes do not contain lead in the pipe walls, homes built before the 1986 Safe Drinking Water Act amendments often used lead-based solder at pipe joints. Only a certified laboratory water test can verify lead levels in your water.',
        immediateActions: [
          'If the house was built before 1986, flush the tap for 30–60 seconds after periods of non-use to clear standing water.',
          'Always use cold water for drinking, cooking, and making baby bottles.',
          'Clean your faucet aerator screens every 6 months to remove any trapped metal debris.'
        ],
        confirmatorySteps: [
          'Check whether soldered joints look silver or lumpy (common in pre-1986 lead solder).',
          'Request a water test kit if you have infants or pregnant family members in the home.'
        ],
        filterRecommendations: 'Standard carbon filters improve taste; if concerned about solder, look for filters certified under NSF/ANSI 53 for lead.',
        utilityNextSteps: 'Copper service lines are generally considered modern standards, but check if the city-side connection was ever galvanized or lead.',
        isDemo
      };

    case 'galvanized_steel':
      return {
        material: 'galvanized_steel',
        materialName: 'Likely Galvanized Steel / Iron',
        riskLevel: 'moderate',
        confidence,
        title: 'Likely Galvanized Steel Pipe',
        summary: 'Your pipe is magnetic with a hard, dull metallic surface, indicating galvanized iron or steel.',
        reasons,
        disclaimer: 'HEALTH NOTE: While galvanized steel is not made of lead, old galvanized pipes can corrode internally and trap lead particles released by upstream historical lead utility mains. When steel corrodes, that trapped lead can enter drinking water.',
        immediateActions: [
          'Flush cold water for 1 to 2 minutes before using for drinking or food preparation.',
          'Inspect water color: if water is brownish or rusty after sitting, notify your landlord or plumber.',
          'Use cold water for cooking and baby formula.'
        ],
        confirmatorySteps: [
          'Check if an upstream "lead gooseneck" or lead pigtail connector exists between the street and your meter.',
          'Order a certified laboratory water test to measure actual lead and iron levels in your tap water.'
        ],
        filterRecommendations: 'Use a certified lead filter (NSF 53) if your home was built before 1986 or if old steel pipes show rust flaking.',
        utilityNextSteps: 'Ask your water utility if your service line connects to a public lead main or if your neighborhood has an active pipe replacement program.',
        isDemo
      };

    case 'plastic':
      return {
        material: 'plastic',
        materialName: 'Plastic / PVC / PEX Pipe',
        riskLevel: 'low',
        confidence,
        title: 'Plastic / PVC Water Pipe',
        summary: 'Your pipe is plastic (such as PVC, CPVC, or PEX). Plastic pipes do not contain lead.',
        reasons,
        disclaimer: 'NOTE: Even with plastic interior pipes, interior brass faucets and fixtures manufactured before 2014 could contain up to 8% lead. Only certified water testing measures what is in the tap.',
        immediateActions: [
          'Always run cold water before drinking if the tap hasn’t been used in hours.',
          'Ensure indoor faucets are certified lead-free (look for NSF/ANSI 61 marks on replacements).'
        ],
        confirmatorySteps: [
          'Verify that the underground service line outside your home is also plastic and was not spliced into an older lead section.'
        ],
        filterRecommendations: 'Standard NSF 42 filtration is generally sufficient for taste and odor, unless brass fixture contamination is suspected.',
        utilityNextSteps: 'No immediate utility pipe replacement typically required for modern plastic service lines.',
        isDemo
      };

    default:
      return {
        material: 'unknown',
        materialName: 'Inconclusive / Unknown Material',
        riskLevel: 'unknown',
        confidence: 'low',
        title: 'Pipe Material Inconclusive',
        summary: 'We were unable to definitively determine your pipe material from the answers provided.',
        reasons,
        disclaimer: 'SAFETY FIRST: Never assume an unidentifiable pipe is safe. Many old pipes are covered in layers of paint, dust, or protective insulation wrap that disguise their true identity.',
        immediateActions: [
          'Do not scrape painted pipes if you suspect lead paint could be on the surface.',
          'Use cold, flushed water for drinking and food preparation as a precaution.',
          'Consider using an NSF 53 certified water filter pitcher while waiting for inspection.'
        ],
        confirmatorySteps: [
          'Find where the water pipe enters your home through the basement floor or foundation wall, before the water meter.',
          'Take a clear, well-lit photo of the pipe and show it to a local licensed plumber or city water inspector.',
          'Request a free water testing kit from your city or county health department.'
        ],
        filterRecommendations: 'Use an NSF 53 certified filter pitcher (like ZeroWater or Brita Elite with lead reduction) until you can confirm your pipe material.',
        utilityNextSteps: 'Call your local water utility customer service line to ask for your property’s historical service line record.',
        isDemo
      };
  }
}
