// Rating Colors Configuration
// Centralized rating color management for consistent styling across the app

// Star text colors based on rating value
export const STAR_COLORS = {
    excellent: 'text-[#5aa5df]',      // > 3.5 stars
    good: 'text-yellow-500',          // 2.5 - 3.5 stars  
    average: 'text-orange-500',       // 2 stars
    poor: 'text-red-500',             // 1 star
    empty: 'text-gray-300',           // unfilled stars
};

// Star fill colors (for filled stars with fill property)
export const STAR_FILL_COLORS = {
    excellent: 'fill-[#5aa5df] text-[#5aa5df]',
    good: 'fill-yellow-500 text-yellow-500',
    average: 'fill-orange-500 text-orange-500',
    poor: 'fill-red-500 text-red-500',
    empty: 'fill-gray-300 text-gray-300',
};

// Progress bar colors for rating breakdown (by star count)
export const BAR_COLORS = {
    5: 'bg-[#5aa5df]',
    4: 'bg-blue-400',
    3: 'bg-yellow-500',
    2: 'bg-orange-500',
    1: 'bg-red-500',
};

// Get star color based on rating value
export const getStarColor = (rating: number): string => {
    if (rating === 1) return STAR_COLORS.poor;
    if (rating === 2) return STAR_COLORS.average;
    if (rating > 2 && rating <= 3.5) return STAR_COLORS.good;
    if (rating > 3.5) return STAR_COLORS.excellent;
    return STAR_COLORS.empty;
};

// Get star fill color based on rating value (for icons with fill)
export const getStarFillColor = (rating: number): string => {
    if (rating <= 2) return STAR_FILL_COLORS.poor;
    if (rating > 2 && rating <= 3.5) return STAR_FILL_COLORS.good;
    if (rating > 3.5) return STAR_FILL_COLORS.excellent;
    return STAR_FILL_COLORS.empty;
};

// Get progress bar color based on star count (1-5)
export const getBarColor = (stars: number): string => {
    return BAR_COLORS[stars as keyof typeof BAR_COLORS] || 'bg-gray-300';
};

// Get rating label based on rating value
export const getRatingLabel = (rating: number): string => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Great';
    if (rating >= 2.5) return 'Average';
    return 'Poor';
};


