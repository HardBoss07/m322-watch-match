import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getButtonClasses,
  getIconButtonClasses,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  BUTTON_RADII,
  ICON_BUTTON_SIZES,
} from './button.variants';

test('getButtonClasses returns expected classes for primary variant', () => {
  const classes = getButtonClasses({
    variant: 'primary',
    size: 'md',
    radius: 'md',
  });
  assert.ok(classes.includes('bg-[#d80b69]'), 'Should contain primary pink background');
  assert.ok(classes.includes('rounded-xl'), 'Should contain md rounded-xl radius');
  assert.ok(classes.includes('h-10'), 'Should contain md height');
});

test('getButtonClasses returns fullWidth class when fullWidth is true', () => {
  const classes = getButtonClasses({
    variant: 'secondary',
    fullWidth: true,
  });
  assert.ok(classes.includes('w-full'), 'Should contain w-full class');
});

test('getButtonClasses applies custom accent variant and custom classes', () => {
  const classes = getButtonClasses({
    variant: 'accent',
    size: 'lg',
    radius: 'full',
    className: 'custom-deck-btn',
  });
  assert.ok(classes.includes('bg-[#ffd405]'), 'Should contain accent yellow background');
  assert.ok(classes.includes('rounded-full'), 'Should contain full radius');
  assert.ok(classes.includes('custom-deck-btn'), 'Should include custom class');
});

test('getIconButtonClasses returns circular icon classes with xl size', () => {
  const classes = getIconButtonClasses({
    variant: 'primary',
    size: 'xl',
    radius: 'full',
  });
  assert.ok(classes.includes('w-15 h-15'), 'Should contain xl 60px dimensions');
  assert.ok(classes.includes('rounded-full'), 'Should contain rounded-full');
  assert.ok(classes.includes('bg-[#d80b69]'), 'Should contain primary background');
});

test('Token definitions contain all standard variants and sizes', () => {
  assert.ok(BUTTON_VARIANTS.primary, 'primary variant exists');
  assert.ok(BUTTON_VARIANTS.secondary, 'secondary variant exists');
  assert.ok(BUTTON_VARIANTS.accent, 'accent variant exists');
  assert.ok(BUTTON_VARIANTS.outline, 'outline variant exists');
  assert.ok(BUTTON_VARIANTS.ghost, 'ghost variant exists');
  assert.ok(BUTTON_VARIANTS.danger, 'danger variant exists');

  assert.ok(BUTTON_SIZES.sm, 'sm size exists');
  assert.ok(BUTTON_SIZES.md, 'md size exists');
  assert.ok(BUTTON_SIZES.lg, 'lg size exists');

  assert.ok(BUTTON_RADII.none, 'none radius exists');
  assert.ok(BUTTON_RADII.sm, 'sm radius exists');
  assert.ok(BUTTON_RADII.md, 'md radius exists');
  assert.ok(BUTTON_RADII.lg, 'lg radius exists');
  assert.ok(BUTTON_RADII.full, 'full radius exists');
});
