import { mount } from '@vue/test-utils'
import DateInput from '../src/components/DataInput.vue'
import { describe, it, expect } from 'vitest'

describe('DateInput', () => {
  it('renders correctly', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: ''
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('sets the correct placeholder based on default locale during SSR', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: '',
        defaultLocale: 'en-GB'
      }
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('DD/MM/YYYY')
  })

  it('updates locale on defaultLocale prop update', async () => {
    Object.defineProperty(window.navigator, 'language', {
      value: 'en-US',
      configurable: true
    })

    const wrapper = mount(DateInput, {
      props: {
        modelValue: '',
        defaultLocale: 'en-US'
      }
    })

    await wrapper.setProps({
      modelValue: '',
      defaultLocale: 'en-GB'
    })

    expect((wrapper.vm as any).locale).toBe('en-GB')
  })

  it('formats the date correctly on blur', async () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    await input.setValue('12/31/2020')
    await input.trigger('blur')

    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['2020-12-31'])
  })

  it('formats the date with incorrect month correctly on blur', async () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    await input.setValue('14/14/2020')
    await input.trigger('blur')

    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['2020-12-14'])
  })

  it('formats the date with incorrect day correctly on blur', async () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    await input.setValue('04/48/2020')
    await input.trigger('blur')

    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['2020-04-30'])
  })
})
