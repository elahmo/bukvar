import {
  loadTimeTrackingPreferenceFromLocalStorage,
  saveTimeTrackingPreferenceToLocalStorage,
} from './localStorage'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe('time tracking preference storage', () => {
  test('returns null when no preference has been saved', () => {
    expect(loadTimeTrackingPreferenceFromLocalStorage()).toBeNull()
  })

  test('round-trips "on"', () => {
    saveTimeTrackingPreferenceToLocalStorage('on')
    expect(loadTimeTrackingPreferenceFromLocalStorage()).toBe('on')
  })

  test('round-trips "off"', () => {
    saveTimeTrackingPreferenceToLocalStorage('off')
    expect(loadTimeTrackingPreferenceFromLocalStorage()).toBe('off')
  })

  test('returns null when the stored value is corrupt JSON', () => {
    localStorage.setItem('timeTrackingPreference', '{not json')
    expect(loadTimeTrackingPreferenceFromLocalStorage()).toBeNull()
  })

  test('returns null when the stored value is JSON but not "on"/"off"', () => {
    localStorage.setItem('timeTrackingPreference', JSON.stringify('maybe'))
    expect(loadTimeTrackingPreferenceFromLocalStorage()).toBeNull()
    localStorage.setItem('timeTrackingPreference', JSON.stringify(true))
    expect(loadTimeTrackingPreferenceFromLocalStorage()).toBeNull()
    localStorage.setItem('timeTrackingPreference', JSON.stringify(null))
    expect(loadTimeTrackingPreferenceFromLocalStorage()).toBeNull()
  })

  test('saves under the "timeTrackingPreference" localStorage key', () => {
    saveTimeTrackingPreferenceToLocalStorage('on')
    expect(localStorage.getItem('timeTrackingPreference')).toBe(
      JSON.stringify('on')
    )
  })
})
