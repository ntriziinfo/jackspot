from pathlib import Path
import audioop
import shutil
import wave


ROOT = Path(__file__).resolve().parents[1] / "assets" / "media" / "jackspot"


def normalize_wav(src_name, out_name, target=0.891):
    src = ROOT / src_name
    out = ROOT / out_name
    with wave.open(str(src), "rb") as reader:
        params = reader.getparams()
        frames = reader.readframes(reader.getnframes())
        width = reader.getsampwidth()
    peak = audioop.max(frames, width) or 1
    max_amp = (1 << (8 * width - 1)) - 1
    factor = min(8.0, (max_amp * target) / peak)
    normalized = audioop.mul(frames, width, factor)
    with wave.open(str(out), "wb") as writer:
        writer.setparams(params)
        writer.writeframes(normalized)


def stage_mp3(src_name, out_name):
    shutil.copyfile(ROOT / src_name, ROOT / out_name)


def main():
    normalize_wav("premium_piero_symbol_raw.wav", "premium_piero_symbol.wav")
    stage_mp3("premium_bb_voice_raw.mp3", "premium_bb_voice.mp3")
    stage_mp3("premium_bb2_bgm_raw.mp3", "premium_bb2_bgm.mp3")
    stage_mp3("premium_first_end_voice_raw.mp3", "premium_first_end_voice.mp3")
    stage_mp3("premium_second_end_voice_raw.mp3", "premium_second_end_voice.mp3")


if __name__ == "__main__":
    main()
