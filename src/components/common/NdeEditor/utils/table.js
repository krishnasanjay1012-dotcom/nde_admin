export function buildTableHTML(rows, cols) {
  const theadRow = `<tr>${'<th></th>'.repeat(cols)}</tr>`;
  const bodyRow = `<tr>${'<td></td>'.repeat(cols)}</tr>`;
  const bodyRows = bodyRow.repeat(Math.max(0, rows - 1));

  return `<table class="squire-table" border="1" cellpadding="5" cellspacing="0">
    <thead>${theadRow}</thead>
    <tbody>${bodyRows}</tbody>
  </table><p></p>`;
}
