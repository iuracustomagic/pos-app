import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, resetDialog } from 'redux/slices/modalSlice';
import SwitchPage from 'common/SwitchPage';
import translate from 'assets/translation';
import { transactions } from 'controllers/index';

function Check() {
  const lang = useSelector((state) => state.application.lang);
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [checkList, setCheckList] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  const findCheck = async (date, statePage) => {
    try {
      const result = await transactions.getCheck(date, statePage);
      if (result.status !== 200) throw new Error('Failed to fecth checks');

      setTotal(result.data.total);
      setCheckList(...result.data.transaction);
    } catch (error) {
      dispatch(setModal({ text: error.message }));
    }
  };

  const save = async () => {
    try {
      const result = await transactions.saveReturn({ _id: checkList._id, items: checkList.items });
      if (result.status !== 200) throw new Error('Failed to fecth checks');
      dispatch(setModal({ text: 'Operation was successfully completed', state: true }));
      dispatch(resetDialog());
    } catch (error) {
      dispatch(setModal({ text: error.message }));
    }
  };

  const removeItem = (idx) => {
    setCheckList((prev) => {
      const copy = { ...prev };

      idx.forEach((element) => {
        copy.items[element].returned = true;
      });

      return copy;
    });
  };

  const restoreItem = (idx) => {
    setCheckList((prev) => {
      const copy = { ...prev };
      copy.items[idx].returned = false;
      return copy;
    });
  };

  const changePage = (value) => {
    setPage((prev) => prev + value);
  };

  useEffect(() => {
    if (timeValue.length + dateValue.length === 15) {
      findCheck(`${dateValue} ${timeValue}:00`, 0);
      setPage(0);
    }
  }, [timeValue, dateValue]);

  useEffect(() => {
    findCheck(timeValue.length + dateValue.length === 15 ? `${dateValue} ${timeValue}:00` : '', page);
  }, [page]);

  useEffect(() => {
    findCheck('', 0);
  }, []);

  return (
    <div className="check-return">
      <input
        onChange={(e) => setDateValue(e.target.value)}
        placeholder={translate[lang]['Type the date from check']}
        value={dateValue}
        min={new Date(new Date() - 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0]}
        max={new Date().toISOString().split('T')[0]}
        className="form-control"
        type="date"
      />
      <input
        onChange={(e) => setTimeValue(e.target.value)}
        placeholder={translate[lang]['Type the time from check']}
        value={timeValue}
        className="form-control mt-2"
        type="time"
      />
      <div className="check-list">
        <div className="check-container mt-3 mb-5">
          <ul className="list-group">
            {
              checkList?.items?.map((item, idx) => (
                <li key={item._id} className={`list-group-item ${item.returned ? 'line' : ''}`}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="check-info flex-grow-1">
                      <span>{ item.name }</span>
                      <div className="d-flex justify-content-between">
                        <span>{ `x ${item.qty}` }</span>
                        <span>{ `Total price: ${item.countedPrice}` }</span>
                      </div>
                    </div>
                    <div className="remove">
                      {
                        item.returned ? (
                          <button onClick={() => restoreItem(idx)} className="btn btn-info" type="button">
                            <i className="fa fa-refresh" />
                          </button>
                        ) : (
                          <button onClick={() => removeItem([idx])} className="btn btn-danger" type="button">
                            <i className="fa fa-times" />
                          </button>
                        )
                      }
                    </div>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      <div className="control-buttons d-flex gap-3">
        {
          checkList?.items?.length ? (
            <button onClick={() => removeItem(checkList.map((_cur, idx) => idx))} className="btn btn-info" type="button">{ translate[lang]['Remove all'] }</button>
          ) : null
        }
        {
          checkList?.items?.some((cur) => cur.returned) ? (
            <button onClick={save} className="btn btn-info" type="button">{ translate[lang].Save }</button>
          ) : null
        }
      </div>
      <SwitchPage changePage={changePage} total={total} page={page} itemsToDisplay={1} />
    </div>
  );
}

export default Check;
