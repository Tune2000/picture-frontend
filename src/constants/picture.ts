export const PIC_REVIEW_STATUS_ENUM = {
  REVIEWING: 0,
  PASS: 1,
  REJECT: 2,
}

export const PIC_REVIEW_STATUS_MAP: { [key: string]: string } = {
  0: '待审核',
  1: '通过',
  2: '拒绝',
}

export const PIC_REVIEW_STATUS_OPTIONS = Object.keys(PIC_REVIEW_STATUS_MAP).map((key) => {
  return {
    label: PIC_REVIEW_STATUS_MAP[key],
    value: key,
  }
})

// PIC_REVIEW_STATUS_OPTIONS
// [
//   { label: '待审核', value: '0' },
//   { label: '通过', value: '1' },
//   { label: '拒绝', value: '2' }
// ]
