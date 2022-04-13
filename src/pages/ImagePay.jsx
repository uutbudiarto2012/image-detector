import React, { useEffect, useState } from 'react'
import { createWorker } from 'tesseract.js';
import Loader from '../components/Loader';

const ImagePay = () => {
  const worker = createWorker();
  const [image, setImage] = useState("")
  const [textRes, setTextRes] = useState('')

  const [namePenerima, setNamePenerima] = useState("FATIMA KUSUMA ISLAMI")
  const [nomorPenerima, setNomorPenerima] = useState("1640003524107")
  const [jumlah, setJumlah] = useState("200000")


  const [namePenerimaFromImage, setNamePenerimaFromImage] = useState("")
  const [nomorPenerimaFromImage, setNomorPenerimaFromImage] = useState("")
  const [jumlahFromImage, setJumlahFromImage] = useState("")

  const [loading, setLoading] = useState(false)

  const [isValid, setIsValid] = useState(false)

  const handleChange = async (e) => {
    setLoading(true)
    setImage(URL.createObjectURL(e.target.files[0]))
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(URL.createObjectURL(e.target.files[0]));
    setTextRes(text)
    await worker.terminate();
    setLoading(false)
  }

  const handleCheckText = () => {
    const name = namePenerima && namePenerima.toLowerCase()
    const number = nomorPenerima && nomorPenerima.toLowerCase()
    const text = textRes && textRes.toLowerCase()
    if (text && text.includes(name) && text.includes(number)) {
      const awalAngka = text.search("rp ") + 3
      const arrayText = text.slice(awalAngka, 300).match(/^(\S+)\s(.*)/).slice(1)
      const duitMentah = arrayText && arrayText[0]
      setJumlahFromImage(duitMentah)
      setNamePenerimaFromImage(name)
      setNomorPenerimaFromImage(number)
      setIsValid(true)
    } else {
      console.log(textRes);
      setIsValid(false)
    }
  }

  // image-default-preview.svg

  useEffect(() => {
    handleCheckText()
  }, [textRes])



  return (
    <div className='wrapper'>
      {
        loading && (
          <div className="loader">
            <Loader />
          </div>
        )
      }
      <div className="box">
        <div className="image-preview">
          <label htmlFor="inputImage" className='imageLabel'>
            <img src={image || "image-default-preview.svg"} alt="image" />
          </label>
          <input type="file" id='inputImage' onChange={handleChange} />
        </div>
        <div className="text-preview">
          <div className="init">
            <span>DUMMY INIT DATA , GANTI NAMA, NOMOR, DAN JUMLAH</span>
            <input type="text" onChange={e => setNamePenerima(e.target.value)} value={namePenerima} />
            <input type="text" onChange={e => setNomorPenerima(e.target.value)} value={nomorPenerima} />
            <input type="text" onChange={e => setJumlah(e.target.value)} value={jumlah} />
          </div>
          <div className="text">
            {
              isValid ? (
                <div className='isMatch'>
                  <h3 className='valid'>HASIL MATCH :</h3>
                  <div className="input-box">
                    PENERIMA : {namePenerimaFromImage} - MATCH
                  </div>
                  <div className="input-box">
                    NOMOR PENERIMA : {nomorPenerimaFromImage} - MATCH
                  </div>
                  <div className="input-box">
                    JUMLAH : {jumlahFromImage} - masih cari cari cara
                  </div>
                </div>
              ) : (
                <>
                  {
                    textRes && !isValid && (
                      <h3 className="invalid">HASIL TIDAK MATCH</h3>
                    )
                  }
                </>
              )
            }
            <div className="resulttext">
              {
                textRes && (
                  <>
                    <h5>INI RESULT ORIGINAL YANG D CEK :</h5>
                    {textRes}
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImagePay


// Transfer Berhasil!
// FATIMA KUSUMA ISLAMI
// Bank Mandiri - 1640003524107
// Metode Transfer Sesama Bank Mandiri
// Total Transaksi Rp 200.000