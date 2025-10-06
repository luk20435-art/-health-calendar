"use client";
import { useState } from "react";
import { Heart, User, Activity, ClipboardList, Calendar } from "lucide-react";

type BloodPressureEntry = { 
  date: string; 
  time: string; 
  systolic: string; 
  diastolic: string; 
  heartRate: string; 
  recorder: string; 
};

type FormDataState = {
  section1: any;
  section2: Record<string, string>;
  section3: Record<string, string>;
  section4: {
    bloodPressure: Record<string, BloodPressureEntry>;
  };
};

export default function HypertensionSurvey() {
  const [formData, setFormData] = useState<FormDataState>({
    section1: { fullName: "", ageYears: "", ageMonths: "", gender: "", weight: "", height: "" },
    section2: {},
    section3: {},
    section4: {
      bloodPressure: {
        beforeProgram1: { date: "", time: "", systolic: "", diastolic: "", heartRate: "", recorder: "" },
        beforeProgram2: { date: "", time: "", systolic: "", diastolic: "", heartRate: "", recorder: "" },
        afterProgram1: { date: "", time: "", systolic: "", diastolic: "", heartRate: "", recorder: "" },
        afterProgram2: { date: "", time: "", systolic: "", diastolic: "", heartRate: "", recorder: "" },
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (section: keyof FormDataState, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSection2Change = (questionId: string, value: string) => {
    setFormData((prev) => ({ ...prev, section2: { ...prev.section2, [questionId]: value } }));
  };

  const handleSection3Change = (questionId: string, value: string) => {
    setFormData((prev) => ({ ...prev, section3: { ...prev.section3, [questionId]: value } }));
  };

  const handleBloodPressureChange = (period: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      section4: {
        bloodPressure: {
          ...prev.section4.bloodPressure,
          [period]: { ...prev.section4.bloodPressure[period], [field]: value } as BloodPressureEntry,
        },
      },
    }));
  };

  const motivationQuestions = [
    "ผู้ที่มีบุคคลในครอบครัวเป็นโรคความดันโลหิตสูงเสี่ยงต่อการป่วยมากกว่าบุคคลอื่น",
    "ผู้ที่มีน้ำหนักเกินหรืออ้วน มีความเสี่ยงต่อโรคความดันโลหิตสูงมากกว่าผู้ที่น้ำหนักปกติ",
    "ผู้ที่มีภาวะเครียดจากการทำงานเป็นประจำ มีโอกาสเสี่ยงต่อการเกิดโรคความดันโลหิตสูง",
    "การรับประทานอาหารไขมันสูง เช่น เนื้อสัตว์ติดมัน มีโอกาสเสี่ยงต่อโรคความดันโลหิตสูง",
    "การรับประทานอาหารรสเค็มเพิ่มความเสี่ยงต่อการเกิดโรคความดันโลหิตสูง",
    "การรับประทานอาหารประเภทผัด/ทอดเป็นประจำเสี่ยงต่อความดันโลหิตสูง",
    "การออกกำลังกายเป็นประจำ 3-5 ครั้งต่อสัปดาห์ ช่วยลดความเสี่ยงต่อความดันโลหิตสูง",
    "การสูบบุหรี่เป็นประจำเสี่ยงต่อความดันโลหิตสูง",
    "การดื่มแอลกอฮอล์เป็นประจำเสี่ยงต่อความดันโลหิตสูง",
    "โรคความดันโลหิตสูงไม่สามารถรักษาให้หายขาดได้",
    "โรคความดันโลหิตสูงสามารถป้องกันได้",
    "โรคความดันโลหิตสูงรุนแรง อาจทำให้เสียชีวิตได้",
    "โรคความดันโลหิตสูงเป็นปัจจัยเสี่ยงต่อหัวใจ",
    "โรคไตวายเรื้อรังเป็นภาวะแทรกซ้อนจากความดันโลหิตสูง",
    "ระดับความดันโลหิตสูงที่ควบคุมไม่ได้ อาจทำให้สมองตีบ/แตก",
    "ผลกระทบจากความดันโลหิตสูง เป็นภาระของครอบครัว",
    "การรับประทานผัก/ผลไม้ที่มีเส้นใยสูง ช่วยป้องกันความดันโลหิตสูง",
    "หลีกเลี่ยงเครื่องปรุงเช่น น้ำปลา/ซีอิ๊ว ช่วยลดความดันโลหิต",
    "หลีกเลี่ยงผัด/ทอด ใช้วิธีต้ม/นึ่ง/ย่างช่วยลดความดัน",
    "ออกกำลังกายสัปดาห์ละ 3 วัน ช่วยป้องกันความดันโลหิตสูง",
    "ออกกำลังกายต่อเนื่อง 30 นาที ช่วยป้องกันความดันโลหิตสูง",
    "หลีกเลี่ยงแกงกะทิช่วยลดความเสี่ยงความดันโลหิตสูง",
    "ผ่อนคลายความเครียดเช่น สวดมนต์/สมาธิ ช่วยลดความเสี่ยง",
    "นอน 6-8 ชั่วโมง ลดความเสี่ยงความดันโลหิตสูง",
    "ลดบุหรี่ช่วยลดสาเหตุความดันโลหิตสูง",
    "หลีกเลี่ยงแอลกอฮอล์/บุหรี่ช่วยป้องกันความดันโลหิตสูง",
    "เชื่อมั่นควบคุมการกินเค็มได้",
    "เชื่อมั่นกินผัก/ผลไม้เส้นใยสูงเป็นประจำ",
    "เชื่อมั่นปรุงอาหารวิธีต้ม/นึ่ง/ย่างได้",
    "มั่นใจออกกำลังกายสัปดาห์ละ 3 วัน",
    "มั่นใจออกกำลังกายต่อเนื่อง 30 นาที",
    "มั่นใจจัดการความเครียดได้",
    "มั่นใจลด/เลิกบุหรี่",
    "มั่นใจลด/เลิกแอลกอฮอล์",
  ];

  const behaviorQuestions = [
    "รับประทานอาหารเค็ม เช่น เนื้อเค็ม ไข่เค็ม ผักดอง",
    "เติมน้ำปลา/ซอสปรุงรสก่อนรับประทาน",
    "รับประทานผัก/ผลไม้เส้นใยสูง",
    "เลือกเนื้อสัตว์ไม่ติดหนัง/มัน",
    "ใช้วิธีต้ม/นึ่ง/ย่างแทนผัด/ทอด",
    "ออกกำลังกายสัปดาห์ละ 3 วัน",
    "ออกกำลังกายต่อเนื่อง 30 นาที",
    "มีกิจกรรมทางกายอื่น ๆ เช่น เดินขึ้นบันได",
    "หางานอดิเรกทำเมื่อมีเวลาว่าง",
    "นอนวันละ 7-8 ชั่วโมง",
    "ผ่อนคลายความเครียดด้วยการนั่ง/นอนสบาย",
    "สูบบุหรี่หรือบุหรี่ไฟฟ้าประจำหรือไม่",
    "ดื่มแอลกอฮอล์เป็นประจำหรือไม่",
  ];

  const bpLabels = {
    beforeProgram1: "ก่อนโครงการ ครั้งที่ 1",
    beforeProgram2: "ก่อนโครงการ ครั้งที่ 2",
    afterProgram1: "หลังโครงการ ครั้งที่ 1",
    afterProgram2: "หลังโครงการ ครั้งที่ 2",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const scriptURL = "https://script.google.com/macros/s/AKfycby1rU8FYvST49GUHrT6QGDr2lLoAo3QQEBDs-3iOsVHrnkh3pcIaPxzuthLy7KG8rcS/exec";
      const flatData: Record<string, string> = {};

      const flattenObject = (obj: any, prefix = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          const newKey = prefix ? `${prefix}_${key}` : key;
          if (typeof value === "object" && value !== null && !Array.isArray(value)) flattenObject(value, newKey);
          else flatData[newKey] = String(value);
        });
      };

      flattenObject(formData.section1, "section1");
      flattenObject(formData.section2, "section2");
      flattenObject(formData.section3, "section3");
      Object.entries(formData.section4.bloodPressure).forEach(([period, bpData]) => {
        Object.entries(bpData).forEach(([field, value]) => {
          flatData[`section4_${period}_${field}`] = value;
        });
      });

      const urlSearchParams = new URLSearchParams(flatData);

      const res = await fetch(scriptURL, { method: "POST", body: urlSearchParams });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const json = await res.json();
      setResult(json.success ? "✅ บันทึกข้อมูลเรียบร้อยแล้ว" : "❌ เกิดข้อผิดพลาดจาก Apps Script: " + (json.error || "ไม่ทราบข้อผิดพลาด"));
    } catch (err: any) {
      setResult("❌ การส่งข้อมูลล้มเหลว: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            แบบฟอร์มสำรวจความดันโลหิต
          </h1>
          <p className="text-gray-600">กรุณากรอกข้อมูลให้ครบถ้วนและตรงตามความเป็นจริง</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ส่วนที่ 1 */}
          <div className="shadow-lg border-t-4 border-t-blue-500 bg-white rounded-lg p-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-t">
              <div className="flex items-center gap-2 text-blue-900 font-semibold text-lg">
                <User className="w-6 h-6" /> ส่วนที่ 1: ข้อมูลส่วนบุคคล
              </div>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ชื่อ-สกุล</label>
                <input type="text" value={formData.section1.fullName} onChange={(e) => handleChange("section1", "fullName", e.target.value)} className="mt-1 block w-full border-gray-300 rounded px-2 py-1" placeholder="กรอกชื่อ-สกุล" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">เพศ</label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-1">
                    <input type="radio" value="ชาย" checked={formData.section1.gender === "ชาย"} onChange={() => handleChange("section1", "gender", "ชาย")} /> ชาย
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" value="หญิง" checked={formData.section1.gender === "หญิง"} onChange={() => handleChange("section1", "gender", "หญิง")} /> หญิง
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">อายุ (ปี)</label>
                <input type="number" value={formData.section1.ageYears} onChange={(e) => handleChange("section1", "ageYears", e.target.value)} className="mt-1 block w-full border-gray-300 rounded px-2 py-1" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">อายุ (เดือน)</label>
                <input type="number" value={formData.section1.ageMonths} onChange={(e) => handleChange("section1", "ageMonths", e.target.value)} className="mt-1 block w-full border-gray-300 rounded px-2 py-1" placeholder="0" />
              </div>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">น้ำหนัก (kg)</label>
                <input type="number" value={formData.section1.weight} onChange={(e) => handleChange("section1", "weight", e.target.value)} className="mt-1 block w-full border-gray-300 rounded px-2 py-1" placeholder="0.0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ส่วนสูง (cm)</label>
                <input type="number" value={formData.section1.height} onChange={(e) => handleChange("section1", "height", e.target.value)} className="mt-1 block w-full border-gray-300 rounded px-2 py-1" placeholder="0.0" />
              </div>
            </div>
          </div>

          {/* ส่วนที่ 2: Motivation */}
          <div className="shadow-lg border-t-4 border-t-green-500 bg-white rounded-lg p-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-t">
              <div className="flex items-center gap-2 text-green-900 font-semibold text-lg">
                <Activity className="w-6 h-6" /> ส่วนที่ 2: ทัศนคติ/แรงจูงใจ
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {motivationQuestions.map((q, idx) => (
                <fieldset key={idx} className="border p-3 rounded">
                  <legend className="font-medium text-gray-700">{idx + 1}. {q}</legend>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-1">
                      <input type="radio" name={`section2_${idx}`} value="0" checked={formData.section2[`q${idx}`] === "0"} onChange={() => handleSection2Change(`q${idx}`, "0")} /> 0
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name={`section2_${idx}`} value="1" checked={formData.section2[`q${idx}`] === "1"} onChange={() => handleSection2Change(`q${idx}`, "1")} /> 1
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name={`section2_${idx}`} value="2" checked={formData.section2[`q${idx}`] === "2"} onChange={() => handleSection2Change(`q${idx}`, "2")} /> 2
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name={`section2_${idx}`} value="3" checked={formData.section2[`q${idx}`] === "3"} onChange={() => handleSection2Change(`q${idx}`, "3")} /> 3
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name={`section2_${idx}`} value="4" checked={formData.section2[`q${idx}`] === "4"} onChange={() => handleSection2Change(`q${idx}`, "4")} /> 4
                    </label>
                  </div>
                </fieldset>
              ))}
            </div>
          </div>

          {/* ส่วนที่ 3: Behavior */}
          <div className="shadow-lg border-t-4 border-t-yellow-500 bg-white rounded-lg p-6">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 rounded-t">
              <div className="flex items-center gap-2 text-yellow-900 font-semibold text-lg">
                <ClipboardList className="w-6 h-6" /> ส่วนที่ 3: พฤติกรรมสุขภาพ
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {behaviorQuestions.map((q, idx) => (
                <fieldset key={idx} className="border p-3 rounded">
                  <legend className="font-medium text-gray-700">{idx + 1}. {q}</legend>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-1">
                      <input type="radio" name={`section3_${idx}`} value="0" checked={formData.section3[`bq${idx}`] === "0"} onChange={() => handleSection3Change(`bq${idx}`, "0")} /> 0
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name={`section3_${idx}`} value="1" checked={formData.section3[`bq${idx}`] === "1"} onChange={() => handleSection3Change(`bq${idx}`, "1")} /> 1
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name={`section3_${idx}`} value="2" checked={formData.section3[`bq${idx}`] === "2"} onChange={() => handleSection3Change(`bq${idx}`, "2")} /> 2
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name={`section3_${idx}`} value="3" checked={formData.section3[`bq${idx}`] === "3"} onChange={() => handleSection3Change(`bq${idx}`, "3")} /> 3
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name={`section3_${idx}`} value="4" checked={formData.section3[`bq${idx}`] === "4"} onChange={() => handleSection3Change(`bq${idx}`, "4")} /> 4
                    </label>
                  </div>
                </fieldset>
              ))}
            </div>
          </div>

          {/* ส่วนที่ 4: Blood Pressure */}
          <div className="shadow-lg border-t-4 border-t-red-500 bg-white rounded-lg p-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-t">
              <div className="flex items-center gap-2 text-red-900 font-semibold text-lg">
                <Calendar className="w-6 h-6" /> ส่วนที่ 4: ความดันโลหิต
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {Object.entries(bpLabels).map(([key, label]) => (
                <fieldset key={key} className="border p-3 rounded">
                  <legend className="font-medium text-gray-700">{label}</legend>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">วันที่</label>
                      <input type="date" value={formData.section4.bloodPressure[key].date} onChange={(e) => handleBloodPressureChange(key, "date", e.target.value)} className="mt-1 block w-full border-gray-300 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">เวลา</label>
                      <input type="time" value={formData.section4.bloodPressure[key].time} onChange={(e) => handleBloodPressureChange(key, "time", e.target.value)} className="mt-1 block w-full border-gray-300 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ความดันตัวบน</label>
                      <input type="number" value={formData.section4.bloodPressure[key].systolic} onChange={(e) => handleBloodPressureChange(key, "systolic", e.target.value)} className="mt-1 block w-full border-gray-300 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ความดันตัวล่าง</label>
                      <input type="number" value={formData.section4.bloodPressure[key].diastolic} onChange={(e) => handleBloodPressureChange(key, "diastolic", e.target.value)} className="mt-1 block w-full border-gray-300 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ชีพจร</label>
                      <input type="number" value={formData.section4.bloodPressure[key].heartRate} onChange={(e) => handleBloodPressureChange(key, "heartRate", e.target.value)} className="mt-1 block w-full border-gray-300 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ผู้บันทึก</label>
                      <input type="text" value={formData.section4.bloodPressure[key].recorder} onChange={(e) => handleBloodPressureChange(key, "recorder", e.target.value)} className="mt-1 block w-full border-gray-300 rounded px-2 py-1" />
                    </div>
                  </div>
                </fieldset>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <button type="submit" disabled={loading} className="w-full md:w-auto px-12 py-3 text-lg font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded shadow">
              {loading ? "กำลังส่งข้อมูล..." : "ส่งข้อมูล"}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow-md text-center">
            <p className="text-lg font-medium">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
