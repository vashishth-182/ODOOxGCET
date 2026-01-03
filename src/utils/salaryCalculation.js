/**
 * Automatic Salary Calculation
 * Based on Monthly Wage, calculates all components and deductions
 */

const SALARY_CONFIG = {
  basicPercentage: 50,              // 50% of Wage
  hraPercentageOfBasic: 50,         // 50% of Basic
  standardAllowance: 4167,          // Fixed
  performanceBonusPercentage: 8.33, // 8.33% of Wage
  ltaPercentage: 8.33,              // 8.33% of Wage
  pfRate: 12,                       // 12% of Gross
  professionalTax: 200              // Fixed
};

/**
 * Calculate salary components from monthly wage
 * @param {number} monthlyWage - Monthly wage amount
 * @returns {object} Complete salary breakdown
 */
export function calculateSalary(monthlyWage) {
  // Components
  const basic = monthlyWage * (SALARY_CONFIG.basicPercentage / 100);
  const hra = basic * (SALARY_CONFIG.hraPercentageOfBasic / 100);
  const standardAllowance = SALARY_CONFIG.standardAllowance;
  const performanceBonus = monthlyWage * (SALARY_CONFIG.performanceBonusPercentage / 100);
  const lta = monthlyWage * (SALARY_CONFIG.ltaPercentage / 100);
  
  // Calculate fixed allowance to balance total to wage
  const sumOfComponents = basic + hra + standardAllowance + performanceBonus + lta;
  const fixedAllowance = monthlyWage - sumOfComponents;
  
  // Gross salary (should equal monthly wage)
  const grossSalary = monthlyWage;
  
  // Deductions
  const providentFund = grossSalary * (SALARY_CONFIG.pfRate / 100);
  const professionalTax = SALARY_CONFIG.professionalTax;
  const totalDeductions = providentFund + professionalTax;
  
  // Net salary
  const netSalary = grossSalary - totalDeductions;
  
  return {
    wageType: 'fixed',
    monthlyWage,
    components: {
      basic: {
        type: 'percentage_of_wage',
        percentage: SALARY_CONFIG.basicPercentage,
        amount: Math.round(basic * 100) / 100
      },
      hra: {
        type: 'percentage_of_basic',
        percentage: SALARY_CONFIG.hraPercentageOfBasic,
        amount: Math.round(hra * 100) / 100
      },
      standardAllowance: {
        type: 'fixed',
        amount: standardAllowance
      },
      performanceBonus: {
        type: 'percentage_of_wage',
        percentage: SALARY_CONFIG.performanceBonusPercentage,
        amount: Math.round(performanceBonus * 100) / 100
      },
      lta: {
        type: 'percentage_of_wage',
        percentage: SALARY_CONFIG.ltaPercentage,
        amount: Math.round(lta * 100) / 100
      },
      fixedAllowance: {
        type: 'auto_calculated',
        amount: Math.round(fixedAllowance * 100) / 100
      }
    },
    deductions: {
      providentFund: {
        rate: SALARY_CONFIG.pfRate,
        amount: Math.round(providentFund * 100) / 100
      },
      professionalTax: {
        amount: professionalTax
      }
    },
    grossSalary: Math.round(grossSalary * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100
  };
}

