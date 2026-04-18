import speech_recognition as sr
import sys
import sounddevice # PyAudio-ku bathula idhu!

def listen():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        # 0.5 seconds noise-ah adjust pannum
        r.adjust_for_ambient_noise(source, duration=0.5)
        try:
            # Mic-la irunthu audio edukka
            audio = r.listen(source, timeout=5, phrase_time_limit=5)
            # Google API use panni text-ah mathum
            query = r.recognize_google(audio, language='en-IN')
            print(query.lower())
            sys.stdout.flush()
        except:
            pass

if __name__ == "__main__":
    while True:
        listen()