import { ChangeEvent, useState } from "react";

const ScheduleButton = ({ day, onToggle }: { day: string, onToggle: (day: string, active: string, time: string) => void }) => {
  const [active, setActive] = useState<string>("false");
  const [time, setTime] = useState<string>("");

  const handleToggle = () => {
    setActive(active==="true"?"false":"true");
    setTime("");
    onToggle(day, active==="true"?"false":"true", "");
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
    onToggle(day, active, event.target.value);
  };

  return (
    <>
      <div>
        <label
          htmlFor={day}
          className={
            active==="true"
              ? "bg-blue-500 text-white font-bold py-1 px-3 mx-2 my-1 border-2 border-blue-500 rounded inline-block"
              : "bg-white border-2 border-blue-500 text-blue-500 font-bold py-1 px-3 mx-2 my-1 rounded inline-block"
          }
        >
          {day}
        </label>
        <input
          id={day}
          className="hidden"
          type="checkbox"
          checked={active==="true"?true:false}
          onChange={handleToggle}
        />
        <div className={active==="true" ? "inline-block" : "hidden"}>
          <label htmlFor={`${day}-input`} className="m-2 inline-block text-lg">
            Timing:
          </label>
          <input
            id={`${day}-input`}
            className="m-2 py-1 px-3 border-2 border-blue-200 rounded inline-block"
            type="text"
            value={time}
            onChange={handleTimeChange}
            placeholder="eg: 8:30-9:30" 
          />
        </div>
      </div>
    </>
  );
};

export default ScheduleButton;
