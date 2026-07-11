# Fix Meal Expansion and Add Item Flow

## Issues Identified
- Add Item button not consistently visible (missing for meals with no items in API response)
- Modal background semi-transparent (rgba(0, 0, 0, 0.7) instead of fully opaque)
- Body scrolling not properly disabled when modal is open
- Modal z-index may need adjustment

## Required Fixes

### 1. Ensure All Meal Types Always Render
- Modify `loadMeals()` to render all meal types (breakfast, lunch, dinner) even if empty
- This ensures Add Item button is always visible for every meal

### 2. Fix Modal Opacity and Visibility
- Change modal overlay background to fully opaque (rgba(0, 0, 0, 1))
- Ensure modal appears centered and fully visible
- Confirm modal is scrollable with overflow-y: auto

### 3. Fix Body Scrolling
- Ensure body overflow is set to 'hidden' when modal opens
- Restore scrolling when modal closes

### 4. Adjust Z-Index
- Ensure modal z-index is higher than meal cards (currently 2000, should be fine)

### 5. State Handling Verification
- Confirm currentMealForForm is set correctly when Add Item clicked
- Ensure currentHostel doesn't affect Add Item visibility

## Implementation Steps
1. Update loadMeals() to always render all meal types
2. Update CSS for modal overlay background opacity
3. Verify and fix body scrolling disable/enable
4. Test modal z-index and scrollability
5. Test complete flow across different hostels
