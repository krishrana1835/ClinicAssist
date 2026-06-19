using System.Collections.Generic;

namespace ClinicAssist.Dtos.Patient
{
    public class PatientListResponseDto
    {
        public List<PatientListDto> Patients { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
    }
}
