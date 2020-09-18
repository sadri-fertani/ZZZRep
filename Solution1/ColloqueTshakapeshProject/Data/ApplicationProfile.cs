using AutoMapper;
using ColloqueTshakapeshProject.Models;

namespace ColloqueTshakapeshProject.Data
{
    public class ApplicationProfile : Profile
    {
        public ApplicationProfile()
        {
            CreateMap<Ecoles, EcoleModel>()
                .ReverseMap();

            CreateMap<Fonctions, FonctionModel>()
              .ReverseMap();

            CreateMap<Participants, ParticipantModel>()
                .ReverseMap();

            CreateMap<TypeColloque, TypeColloqueModel>()
                .ReverseMap();

            CreateMap<Participants, ParticipantModel>()
                .ForMember(p => p.EcoleId, o => o.MapFrom(m => m.Ecole.Id))
                .ForMember(p => p.EcoleName, o => o.MapFrom(m => m.Ecole.Nom))
                .ForMember(p => p.FonctionId, o => o.MapFrom(m => m.Fonction.Id))
                .ForMember(p => p.FonctionName, o => o.MapFrom(m => m.Fonction.Nom));

            CreateMap<ParticipantModel, Participants>()
                .ForMember(p => p.Ecole, o => o.Ignore())
                .ForMember(p => p.Fonction, o => o.Ignore());

            CreateMap<Colloques, ColloqueModel>()
                .ForMember(p => p.TypeId, o => o.MapFrom(m => m.Type.Id))
                .ForMember(p => p.TypeName, o => o.MapFrom(m => m.Type.Nom));


            CreateMap<ColloqueModel, Colloques>()
                .ForMember(p => p.Type, o => o.Ignore());

            CreateMap<Inscriptions, InscriptionModel>()
             .ForMember(p => p.ColloqueId, o => o.MapFrom(m => m.Colloque.Id))
             .ForMember(p => p.ColloqueName, o => o.MapFrom(m => m.Colloque.Titre))
             .ForMember(p => p.ParticipantId, o => o.MapFrom(m => m.Participant.Id))
             .ForMember(p => p.ParticipantName, o => o.MapFrom(m => m.Participant.Nom))
             .ForMember(p => p.ParticipantPrenom, o => o.MapFrom(m => m.Participant.Prenom));

            CreateMap<InscriptionModel, Inscriptions>()
                .ForMember(p => p.Colloque, o => o.Ignore())
                .ForMember(p => p.Participant, o => o.Ignore());
        }
    }
}
