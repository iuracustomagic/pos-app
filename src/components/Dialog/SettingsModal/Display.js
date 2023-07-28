/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import translate from 'assets/translation';

function Display({ setSendData, sendData, state, listDevices, setImages, images, setUnload }) {
  const lang = useSelector((store) => store.application.lang);

  const edit = (e, param) => {
    setSendData({
      ...sendData,
      connectedDevices: {
        ...sendData.connectedDevices,
        display: {
          ...sendData.connectedDevices.display,
          [param]: e.target.value,
        },
      },
    });
  };

  const addImage = () => {
    setImages((oldVal) => [...oldVal, false]);
  };

  const setImage = (e) => {
    const imgName = `${Date.now()}.jpg`;

    const renamedFile = new File([e.target.files[0]], imgName, {
      type: e.target.files[0].type,
    });

    setUnload((oldVal) => [renamedFile, ...oldVal]);
  };

  const removeImage = (image, idx) => {
    setSendData({
      ...sendData,
      deleteImgs: [...(sendData.deleteImgs || []), image],
    });

    setImages((prev) => {
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  return (
    <div className="container display">
      <button onClick={addImage} className="btn btn-primary m-r-15" type="button">Add image</button>
      <div className="d-flex">
        <div className="col-md-6">
          <div className={`form-group ${state ? 'was-validated' : ''}`}>
            <label>Choose manufacturer</label>
            <select onChange={(e) => edit(e, 'model')} style={{ textTransform: 'capitalize' }} defaultValue={sendData?.connectedDevices?.display?.model || ''} className="form-select" required="required">
              <option value="">{ translate[lang]['Select a manufacturer'] }</option>
              {
                Object.keys(listDevices.display).map((manufac) => (
                  <option style={{ textTransform: 'capitalize' }} key={manufac} value={manufac}>{ manufac }</option>
                ))
              }
            </select>
            <div className="invalid-feedback">Please set the fiscal printer!</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className={`form-group ${state ? 'was-validated' : ''}`}>
            <label>Choose model</label>
            <br />
            {
              listDevices.display[sendData?.connectedDevices?.display?.model]?.length ? (
                <select onChange={(e) => edit(e, 'version')} style={{ textTransform: 'capitalize' }} value={sendData?.connectedDevices?.display?.version || ''} className="form-select" required="required">
                  <option value="">{ translate[lang]['Select a model'] }</option>
                  {
                    listDevices.display[sendData?.connectedDevices?.display?.model].map((mod) => (
                      <option style={{ textTransform: 'capitalize' }} key={mod.version} value={mod.version}>{ mod.version }</option>
                    ))
                  }
                </select>
              ) : <span>{ translate[lang]['Sorry, we don\'t have yet models for this manufacter']}</span>
            }
            <div className="invalid-feedback">Please set the fiscal printer model!</div>
          </div>
        </div>
      </div>
      <div className="image-container col-md-6">
        {
          images.map((cur, idx) => (
            <div className="image mb-2" key={`img-${cur}-${idx}-png`}>
              {
                cur ? (
                  <div className="img-block">
                    <div className="d-flex align-items-center">
                      <img src={`ad/${cur}`} alt="img" />
                      <button onClick={() => { removeImage(cur, idx); }} type="button" className="btn btn-danger">
                        <i className="fa fa-times" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-d-block">
                    <input onChange={setImage} type="file" accept=".png,.jpg,.jpeg" />
                  </div>
                )
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}

Display.propTypes = {
  setSendData: PropTypes.func.isRequired,
  sendData: PropTypes.object.isRequired,
  state: PropTypes.bool.isRequired,
  listDevices: PropTypes.object.isRequired,
  setImages: PropTypes.func.isRequired,
  setUnload: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
};

export default Display;
