import { getPaginationParams } from '../../../src/adapters/pagination'

describe('getPaginationParams', () => {
  const MAX_LIMIT = 100

  function makeParams(obj: Record<string, string | undefined>): URLSearchParams {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) params.set(key, value)
    }
    return params
  }

  it('should return defaults when no params are provided', () => {
    const params = makeParams({})
    expect(getPaginationParams(params)).toEqual({ limit: MAX_LIMIT, offset: 0 })
  })

  it('should use valid limit and offset', () => {
    const params = makeParams({ limit: '10', offset: '20' })
    expect(getPaginationParams(params)).toEqual({ limit: 10, offset: 20 })
  })

  it('should use MAX_LIMIT if limit is missing or invalid', () => {
    expect(getPaginationParams(makeParams({ offset: '5' }))).toEqual({ limit: MAX_LIMIT, offset: 5 })
    expect(getPaginationParams(makeParams({ limit: 'abc', offset: '5' }))).toEqual({ limit: MAX_LIMIT, offset: 5 })
    expect(getPaginationParams(makeParams({ limit: '-1', offset: '5' }))).toEqual({ limit: MAX_LIMIT, offset: 5 })
    expect(getPaginationParams(makeParams({ limit: '0', offset: '5' }))).toEqual({ limit: MAX_LIMIT, offset: 5 })
    expect(getPaginationParams(makeParams({ limit: '200', offset: '5' }))).toEqual({ limit: MAX_LIMIT, offset: 5 })
  })

  it('should default offset to 0 if missing or invalid', () => {
    expect(getPaginationParams(makeParams({ limit: '10' }))).toEqual({ limit: 10, offset: 0 })
    expect(getPaginationParams(makeParams({ limit: '10', offset: 'abc' }))).toEqual({ limit: 10, offset: 0 })
    expect(getPaginationParams(makeParams({ limit: '10', offset: '-5' }))).toEqual({ limit: 10, offset: 0 })
  })

  it('should handle both limit and offset missing', () => {
    expect(getPaginationParams(makeParams({}))).toEqual({ limit: MAX_LIMIT, offset: 0 })
  })
})
