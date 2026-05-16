import { motion } from 'framer-motion'
import { User, Calendar, Briefcase, ChevronDown, Mars, Venus } from 'lucide-react'

export function StepPersonal({ data, setData }) {
  return (
    <motion.div
      key="step0"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
    >
      
      <div>
        <div className="section-label">Step 1 of 5</div>
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
          Siapa <span className="grad-text">Kamu?</span>
        </h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          Ceritakan sedikit tentang dirimu supaya kami bisa membantu perencanaan finansialmu.
        </p>
      </div>

      
      <div className="flex flex-col gap-5">
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Nama Lengkap <span style={{ color: '#00f5ff' }}>*</span>
          </label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={data.fullName}
              onChange={e => setData(d => ({ ...d, fullName: e.target.value }))}
              className="finput"
            />
          </div>
        </div>

        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Jenis Kelamin <span style={{ color: '#00f5ff' }}>*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'male', label: 'Pria', icon: Mars },
              { value: 'female', label: 'Wanita', icon: Venus },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setData(d => ({ ...d, gender: opt.value }))}
                className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 transition-all duration-300"
                style={{
                  background: data.gender === opt.value ? 'rgba(0,245,255,0.1)' : 'rgba(0,245,255,0.04)',
                  border: `1px solid ${data.gender === opt.value ? 'rgba(0,245,255,0.5)' : 'rgba(0,245,255,0.12)'}`,
                  fontFamily: 'Sora, sans-serif',
                }}
              >
                <opt.icon size={18} style={{ color: data.gender === opt.value ? '#00f5ff' : 'var(--text-dim)' }} />
                <span className="text-sm font-semibold" style={{ color: data.gender === opt.value ? '#00f5ff' : 'var(--text-muted)' }}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Tanggal Lahir <span style={{ color: '#00f5ff' }}>*</span>
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
            <input
              type="date"
              value={data.birthDate}
              onChange={e => setData(d => ({ ...d, birthDate: e.target.value }))}
              className="finput"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Jenis Pekerjaan <span style={{ color: '#00f5ff' }}>*</span>
          </label>
          <div className="relative">
            <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
            <select
              value={data.jobType}
              onChange={e => setData(d => ({ ...d, jobType: e.target.value }))}
              className="finput pr-10 cursor-pointer"
            >
              <option value="">Pilih pekerjaan</option>
              <option value="employee">Karyawan / Pegawai</option>
              <option value="entrepreneur">Wiraswasta / Entrepreneur</option>
              <option value="freelancer">Freelancer</option>
              <option value="government">PNS / Pemerintah</option>
              <option value="student">Mahasiswa</option>
              <option value="retired">Pensiunan</option>
              <option value="other">Lainnya</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}