import { Slug } from './slug'

describe('Slug test', () => {
  it('Should be able a new slug from text', () => {
    const slug = Slug.createFromText('An example title')

    expect(slug.value).toEqual('an-example-title')
  })
})
