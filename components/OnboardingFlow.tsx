"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { OnboardingPayload } from "@/lib/services/onboardingService";

type Gender = "male" | "female" | "other";
type InterestedIn = "men" | "women" | "everyone";
type LookingFor = "life_partner" | "casual" | "friendship" | "not_sure";
type Religion = "hindu" | "muslim" | "christian" | "sikh" | "buddhist" | "jain" | "other";
type Workout = "regularly" | "sometimes" | "never";
type Drinking = "yes" | "socially" | "no";
type Smoking = "yes" | "sometimes" | "no";
type Education = "high_school" | "in_college" | "bachelors" | "masters" | "phd" |"posgraduation" |"undergraduation";

interface Props {
  onSubmit: (payload: OnboardingPayload) => void;
}

interface FormState {
  name: string;
  gender: Gender | "";
  interestedIn: InterestedIn | "";
  lookingFor: LookingFor | "";
  religion: Religion | "";
  distancePreference: number; // km
  minAge: number;
  maxAge: number;
  heightUnit: "cm" | "ft";
  height: number; // cm OR feet(.0/.5)
  // optional lifestyle
  workout?: Workout | "";
  drinking?: Drinking | "";
  smoking?: Smoking | "";
  education?: Education | "";
}

const Welcome = ({ onStart }: { onStart: () => void }) => (
  <div className="min-h-screen bg-gradient-to-b from-[#FAF7F5] to-[#E05265] flex items-center justify-center p-4">
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-lg shadow-2xl text-center min-h-[560px] md:min-h-[620px] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-2">
        <div className="w-20 h-20 bg-[#FAF7F5] rounded-full mb-6 flex items-center justify-center">
          <Image src="/assets/logo/heart.png" alt="Flowly Logo" height={40} width={40} priority />
        </div>
        <h2 className="font-secondary text-3xl md:text-4xl text-[#E05265] mb-4">Welcome to Flowly</h2>
        <p className="text-[#7C706A] font-app text-base md:text-lg leading-relaxed mb-6 max-w-[520px]">
          Let&apos;s set up your preferences so we can find great matches for you. This takes ~2 minutes.
        </p>
        <div className="bg-[#FAF7F5] rounded-2xl p-4 mb-6 text-sm text-[#7C706A] text-left w-full max-w-sm">
          <div>💖 Personalize your experience</div>
          <div>🎯 Better matches from day one</div>
          <div>✨ You can edit later in Settings</div>
        </div>
      </div>

      <div className="py-2">
        <Button onClick={onStart} className="w-full bg-[#E05265] hover:bg-pink-600 text-white rounded-2xl py-4 text-lg">
          Let&apos;s get started
        </Button>
      </div>
    </div>
  </div>
);

export default function OnboardingFlow({ onSubmit }: Props) {
  const [step, setStep] = useState<number>(0); // 0: welcome
  const [form, setForm] = useState<FormState>({
    name: "",
    gender: "",
    interestedIn: "",
    lookingFor: "",
    religion: "",
    distancePreference: 25,
    minAge: 19,
    maxAge: 28,
    heightUnit: "cm",
    height: 170,
    workout: "",
    drinking: "",
    smoking: "",
    education: "",
  });

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const steps = useMemo(
    () => [
      "welcome",
      "name",
      "gender",
      "interestedIn",
      "lookingFor",
      "religion",
      "distance",
      "ageRange",
      "height",
      "workout(optional)",
      "drinking(optional)",
      "smoking(optional)",
      "education(optional)",
      "review",
    ],
    []
  );

  const requiredValid = useMemo(() => {
    return (
      !!form.name.trim() &&
      !!form.gender &&
      !!form.interestedIn &&
      !!form.lookingFor &&
      !!form.religion
    );
  }, [form]);

  const toHeightString = (): string => {
    if (form.heightUnit === "cm") return `${form.height} cm`;
    // feet in 0.5 increments → "'6" represents 0.5
    return `${Math.floor(form.height)}'${form.height % 1 === 0.5 ? "6" : "0"}`;
  };

  const handleSubmit = () => {
    const payload: OnboardingPayload = {
      name: form.name.trim(),
      gender: form.gender as Gender,
      interestedIn: form.interestedIn as InterestedIn,
      lookingFor: form.lookingFor as LookingFor,
      religion: form.religion as Religion,
      distancePreference: form.distancePreference,
      minAge: form.minAge,
      maxAge: form.maxAge,
      heightString: toHeightString(),
      workout: form.workout || undefined,
      drinking: form.drinking || undefined,
      smoking: form.smoking || undefined,
      education: form.education || undefined,
    };
    onSubmit(payload);
  };

  // If welcome
  if (steps[step] === "welcome") return <Welcome onStart={() => setStep(step + 1)} />;

  // Shell component: fixed card structure so height doesn't jump.
  const Shell: React.FC<{
    children: React.ReactNode;
    canNext?: boolean;
    onNext?: () => void;
    onBack?: () => void;
    nextLabel?: string;
    showSkip?: boolean;
    onSkip?: () => void;
  }> = ({ children, canNext = true, onNext, onBack, nextLabel = "Next", showSkip, onSkip }) => (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: "linear-gradient(to bottom, #FAF7F5, #E05265)" }}>
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl min-h-[560px] md:min-h-[620px] flex flex-col">
        <div className="flex-0">
          <div className="w-14 h-14 bg-[#FAF7F5] rounded-full mb-6 flex items-center justify-center mx-auto">
            <Image src="/assets/logo/heart.png" alt="Flowly Logo" width={30} height={30} />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-1">
          {children}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => setStep(Math.max(1, step - 1))}
            variant="outline"
            className="border-[#E05265] text-[#E05265] bg-transparent hover:bg-white flex-1"
            disabled={step <= 1}
          >
            Back
          </Button>
          {showSkip && (
            <Button onClick={onSkip} variant="outline" className="flex-1">
              Skip
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={!canNext}
            className="bg-[#E05265] hover:bg-pink-600 text-white flex-1"
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );

  const stepKey = steps[step];

  // NAME
  if (stepKey === "name") {
    return (
      <Shell canNext={!!form.name.trim()} onNext={() => setStep(step + 1)}>
        <div className="text-center">
          <h2 className="font-secondary text-2xl text-[#E05265] mb-8">What&apos;s your name?</h2>
          <div className="flex justify-center">
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Enter your name"
              className="w-full max-w-sm border rounded-2xl p-4 bg-white text-[#7C706A] text-center"
              autoFocus
            />
          </div>
        </div>
      </Shell>
    );
  }

  // GENDER
  if (stepKey === "gender") {
    const opts: Gender[] = ["male", "female", "other"];
    return (
      <Shell canNext={!!form.gender} onNext={() => setStep(step + 1)}>
        <div className="text-center">
          <h2 className="font-secondary text-2xl text-[#E05265] mb-8">What&apos;s your gender?</h2>
          <div className="flex gap-3 flex-wrap justify-center">
            {opts.map((g) => (
              <Button
                key={g}
                onClick={() => setField("gender", g)}
                className={`px-6 py-3 rounded-2xl ${form.gender === g ? "bg-[#E05265] text-white" : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"}`}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  // INTERESTED IN
  if (stepKey === "interestedIn") {
    const opts: InterestedIn[] = ["men", "women", "everyone"];
    return (
      <Shell canNext={!!form.interestedIn} onNext={() => setStep(step + 1)}>
        <div className="text-center">
          <h2 className="font-secondary text-2xl text-[#E05265] mb-8">Who are you interested in?</h2>
          <div className="flex gap-3 flex-wrap justify-center">
            {opts.map((o) => (
              <Button
                key={o}
                onClick={() => setField("interestedIn", o)}
                className={`px-6 py-3 rounded-2xl ${form.interestedIn === o ? "bg-[#E05265] text-white" : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"}`}
              >
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  // LOOKING FOR
  if (stepKey === "lookingFor") {
    const opts: LookingFor[] = ["life_partner", "casual", "friendship", "not_sure"];
    return (
      <Shell canNext={!!form.lookingFor} onNext={() => setStep(step + 1)}>
        <div className="text-center">
          <h2 className="font-secondary text-2xl text-[#E05265] mb-8">What are you looking for?</h2>
          <div className="flex gap-3 flex-wrap justify-center">
            {opts.map((o) => (
              <Button
                key={o}
                onClick={() => setField("lookingFor", o)}
                className={`px-4 py-3 rounded-2xl ${form.lookingFor === o ? "bg-[#E05265] text-white" : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"}`}
              >
                {o.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  // RELIGION
  if (stepKey === "religion") {
    const opts: Religion[] = ["hindu", "muslim", "christian", "sikh", "buddhist", "jain", "other"];
    return (
      <Shell canNext={!!form.religion} onNext={() => setStep(step + 1)}>
        <div className="text-center">
          <h2 className="font-secondary text-2xl text-[#E05265] mb-8">What is your religion?</h2>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {opts.map((o) => (
              <Button
                key={o}
                onClick={() => setField("religion", o)}
                className={`px-4 py-3 rounded-2xl ${form.religion === o ? "bg-[#E05265] text-white" : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"}`}
              >
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  // DISTANCE
  if (stepKey === "distance") {
    return (
      <Shell canNext onNext={() => setStep(step + 1)}>
        <div className="text-center">
          <h2 className="font-secondary text-2xl text-[#E05265] mb-8">How far can your matches be?</h2>
          <div className="max-w-sm mx-auto">
            <input
              type="range"
              min={1}
              max={150}
              value={form.distancePreference}
              onChange={(e) => setField("distancePreference", parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #E05265 0%, #E05265 ${((form.distancePreference - 1) / (150 - 1)) * 100}%, #e5e7eb ${((form.distancePreference - 1) / (150 - 1)) * 100}%, #e5e7eb 100%)`
              }}
            />
            <p className="text-center text-lg font-medium text-[#E05265] mt-4">{form.distancePreference} km</p>
          </div>
        </div>
      </Shell>
    );
  }

  // AGE RANGE
  if (stepKey === "ageRange") {
    return (
      <Shell canNext onNext={() => setStep(step + 1)}>
        <div className="text-center">
          <h2 className="font-secondary text-2xl text-[#E05265] mb-8">Preferred age range</h2>
          <div className="max-w-sm mx-auto space-y-6">
            <div>
              <label className="text-sm font-medium text-[#7C706A] block mb-2">Min Age</label>
              <input
                type="range"
                min={18}
                max={50}
                value={form.minAge}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setField("minAge", v);
                  if (form.maxAge < v) setField("maxAge", v);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #E05265 0%, #E05265 ${((form.minAge - 18) / (50 - 18)) * 100}%, #e5e7eb ${((form.minAge - 18) / (50 - 18)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <p className="text-center text-lg font-medium text-[#E05265] mt-2">{form.minAge} years</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#7C706A] block mb-2">Max Age</label>
              <input
                type="range"
                min={18}
                max={50}
                value={form.maxAge}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setField("maxAge", v);
                  if (form.minAge > v) setField("minAge", v);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #E05265 0%, #E05265 ${((form.maxAge - 18) / (50 - 18)) * 100}%, #e5e7eb ${((form.maxAge - 18) / (50 - 18)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <p className="text-center text-lg font-medium text-[#E05265] mt-2">{form.maxAge} years</p>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // HEIGHT
  if (stepKey === "height") {
    return (
      <Shell canNext onNext={() => setStep(step + 1)}>
        <div className="text-center">
          <h2 className="font-secondary text-2xl text-[#E05265] mb-8">What is your height?</h2>
          <div className="max-w-sm mx-auto">
            <div className="flex gap-2 mb-6 justify-center">
              <Button
                onClick={() => {
                  if (form.heightUnit !== "cm") {
                    const cm = Math.round(form.height * 30.48);
                    setForm((p) => ({ ...p, heightUnit: "cm", height: cm }));
                  }
                }}
                className={`px-6 py-2 rounded-2xl ${form.heightUnit === "cm" ? "bg-[#E05265] text-white" : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"}`}
              >
                cm
              </Button>
              <Button
                onClick={() => {
                  if (form.heightUnit !== "ft") {
                    const ft = Math.round((form.height / 30.48) * 2) / 2;
                    setForm((p) => ({ ...p, heightUnit: "ft", height: ft }));
                  }
                }}
                className={`px-6 py-2 rounded-2xl ${form.heightUnit === "ft" ? "bg-[#E05265] text-white" : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"}`}
              >
                ft
              </Button>
            </div>
            <select
              value={form.height}
              onChange={(e) => setField("height", parseFloat(e.target.value))}
              className="w-full border rounded-2xl p-4 bg-white text-center text-lg"
            >
              {form.heightUnit === "cm"
                ? Array.from({ length: 81 }, (_, i) => 140 + i).map((cm) => (
                    <option key={cm} value={cm}>{cm} cm</option>
                  ))
                : Array.from({ length: 25 }, (_, i) => 4 + i * 0.5).map((ft) => (
                    <option key={ft} value={ft}>
                      {Math.floor(ft)}&apos; {ft % 1 === 0.5 ? "6" : "0"}&quot;
                    </option>
                  ))}
            </select>
          </div>
        </div>
      </Shell>
    );
  }

  // helper for optional cards
  const optionalCard = (title: string, options: string[], value: string, setValue: (v: string) => void) => (
    <div className="text-center">
      <h2 className="font-secondary text-2xl text-[#E05265] mb-8">{title}</h2>
      <div className="flex gap-3 flex-wrap justify-center max-w-sm mx-auto">
        {options.map((opt) => (
          <Button
            key={opt}
            onClick={() => setValue(opt)}
            className={`px-4 py-3 rounded-2xl ${value === opt ? "bg-[#E05265] text-white" : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"}`}
          >
            {opt.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Button>
        ))}
      </div>
    </div>
  );

  // WORKOUT (optional)
  if (stepKey === "workout(optional)") {
    return (
      <Shell
        canNext
        onNext={() => setStep(step + 1)}
        showSkip
        onSkip={() => {
          setField("workout", "");
          setStep(step + 1);
        }}
      >
        {optionalCard(
          "How often do you work out? (optional)",
          ["regularly", "sometimes", "never"],
          form.workout || "",
          (v) => setField("workout", v as Workout)
        )}
      </Shell>
    );
  }

  // DRINKING (optional)
  if (stepKey === "drinking(optional)") {
    return (
      <Shell
        canNext
        onNext={() => setStep(step + 1)}
        showSkip
        onSkip={() => {
          setField("drinking", "");
          setStep(step + 1);
        }}
      >
        {optionalCard(
          "Do you drink? (optional)",
          ["yes", "socially", "no"],
          form.drinking || "",
          (v) => setField("drinking", v as Drinking)
        )}
      </Shell>
    );
  }

  // SMOKING (optional)
  if (stepKey === "smoking(optional)") {
    return (
      <Shell
        canNext
        onNext={() => setStep(step + 1)}
        showSkip
        onSkip={() => {
          setField("smoking", "");
          setStep(step + 1);
        }}
      >
        {optionalCard(
          "Do you smoke? (optional)",
          ["yes", "sometimes", "no"],
          form.smoking || "",
          (v) => setField("smoking", v as Smoking)
        )}
      </Shell>
    );
  }

  // EDUCATION (optional)
  if (stepKey === "education(optional)") {
    return (
      <Shell
        canNext
        onNext={() => setStep(step + 1)}
        showSkip
        onSkip={() => {
          setField("education", "");
          setStep(step + 1);
        }}
      >
        {optionalCard(
          "Your education (optional)",
          ["high_school", "in_college", "bachelors", "masters", "phd","posgraduation","undergraduation"],
          form.education || "",
          (v) => setField("education", v as Education)
        )}
      </Shell>
    );
  }

  // REVIEW
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F5] to-[#E05265] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-lg shadow-2xl text-center min-h-[560px] md:min-h-[620px] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-1">
          <div className="w-20 h-20 bg-[#FAF7F5] rounded-full mx-auto mb-6 flex items-center justify-center">
            <Image src="/assets/logo/heart.png" alt="Flowly Logo" height={40} width={40} />
          </div>
          <h2 className="font-secondary text-3xl md:text-4xl text-[#E05265] mb-4">All set 🎉</h2>
          <p className="text-[#7C706A] font-app text-base md:text-lg leading-relaxed mb-6">
            We&apos;ll use these details to find compatible matches. You can edit anything later.
          </p>
          <div className="bg-[#FAF7F5] rounded-2xl p-4 mb-6 text-left text-sm text-[#7C706A] overflow-y-auto max-h-[220px] w-full">
            <p><b>Name:</b> {form.name}</p>
            <p><b>Gender:</b> {form.gender}</p>
            <p><b>Interested in:</b> {form.interestedIn}</p>
            <p><b>Looking for:</b> {form.lookingFor.replace("_", " ")}</p>
            <p><b>Religion:</b> {form.religion}</p>
            <p><b>Distance:</b> {form.distancePreference} km</p>
            <p><b>Age range:</b> {form.minAge}-{form.maxAge}</p>
            <p><b>Height:</b> {form.heightUnit === "cm" ? `${form.height} cm` : `${Math.floor(form.height)}'${form.height % 1 === 0.5 ? "6" : "0"}`}</p>
            {!!form.workout && <p><b>Workout:</b> {form.workout}</p>}
            {!!form.drinking && <p><b>Drinking:</b> {form.drinking}</p>}
            {!!form.smoking && <p><b>Smoking:</b> {form.smoking}</p>}
            {!!form.education && <p><b>Education:</b> {form.education}</p>}
          </div>
        </div>

        <div className="mt-2 w-full">
          <Button
            onClick={handleSubmit}
            disabled={!requiredValid}
            className="w-full bg-[#E05265] hover:bg-pink-600 text-white rounded-2xl py-4 text-lg disabled:opacity-50"
          >
            Save & Continue
          </Button>

          {!requiredValid && (
            <p className="text-xs text-red-500 mt-3">
              Please fill the required details (Name, Gender, Interested In, Looking For, Religion).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}