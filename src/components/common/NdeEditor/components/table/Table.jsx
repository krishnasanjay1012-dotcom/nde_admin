import { useState, useEffect } from 'react';
import tabel from './TableSelector.module.css';

const MAX_ROWS = 20;
const MAX_COLS = 20;
const INITIAL_SIZERow = 5;
const INITIAL_SIZECol = 11;

export default function TableSelector({ onSelect }) {
  const [rows, setRows] = useState(INITIAL_SIZERow);
  const [cols, setCols] = useState(INITIAL_SIZECol);
  const [hoverRows, setHoverRows] = useState(0);
  const [hoverCols, setHoverCols] = useState(0);

  useEffect(() => {
    const newRows = Math.min(Math.max(hoverRows + 1, INITIAL_SIZERow), MAX_ROWS);
    const newCols = Math.min(Math.max(hoverCols + 1, INITIAL_SIZECol), MAX_COLS);

    if (newRows !== rows) setRows(newRows);
    if (newCols !== cols) setCols(newCols);
  }, [hoverRows, hoverCols, rows, cols]);

  const handleMouseMove = (i, j) => {
    setHoverRows(i + 1);
    setHoverCols(j + 1);
  };

  const resetTable = () => {
    setRows(INITIAL_SIZERow);
    setCols(INITIAL_SIZECol);
    setHoverRows(0);
    setHoverCols(0);
  };

  const handleInsert = () => {
    if (!hoverRows || !hoverCols) return;

    onSelect?.(hoverRows, hoverCols);
    resetTable();
  };

  return (
    <div className={tabel.menuitem__table}>
      <div className={tabel.menuitem__table__collapse}>
        <table className={tabel.tablepanel} onClick={handleInsert}>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className={tabel.tablerow}>
                {Array.from({ length: cols }).map((_, j) => (
                  <td
                    key={j}
                    className={`${tabel.tablecell} ${
                      i < hoverRows && j < hoverCols ? tabel.active : ''
                    }`}
                    onMouseEnter={() => handleMouseMove(i, j)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '14px',
            color: 'gray',
            marginTop: '1px',
          }}
        >
          {hoverRows}x{hoverCols}
        </div>
      </div>
    </div>
  );
}
