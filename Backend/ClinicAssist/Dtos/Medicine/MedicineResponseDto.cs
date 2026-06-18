namespace ClinicAssist.Dtos.Medicine
{
    public class MedicineResponseDto
    {
        public int MedicineId { get; set; }
        public int ClinicId { get; set; }
        public string MedicineName { get; set; } = null!;
        public string? Description { get; set; }
        public int Stock { get; set; }
    }
}
