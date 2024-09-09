export const onAction = (e: React.MouseEvent, nextFunc: Function) => {
    e.stopPropagation()
    nextFunc()
  }