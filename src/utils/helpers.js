export function setButtonText(
  btn,
  isLoading,
  _defaultText = "Save",
  _loadingText = "Saving..."
) {
  if (isLoading) {
    btn.textContent = _loadingText;
  } else {
    btn.textContent = _defaultText;
  }
}
